import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CAPITALS_DATA } from "../capitalsData";
import {
  getCapitalCubeTwist,
  getCapitalCubeAssembly,
  getCapitalCarouselCubeFaces,
} from "../capitalCubeTwists";
import { RubikCube3D } from "../../../components/common/RubikCube3D";
import { useLiveCarouselPosition } from "../../../hooks/useLiveCarouselPosition";
import {
  lockCarouselScrollSync,
  unlockCarouselScrollSync,
} from "../carouselSyncLock";
import { scrollToCapitalMarker } from "../carouselScrollSync";

interface CapitalCubeCarouselProps {
  activeSectionIndex: number;
  scrollProgress: number;
  sizeMultiplier?: number;
  className?: string;
}

function getCarouselMetrics() {
  const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const spread = Math.round(Math.min(240, Math.max(160, vw * 0.17)));
  const sceneH = Math.round(Math.min(500, Math.max(320, vh * 0.56)));
  const maxSceneW = Math.round(Math.min(920, Math.max(640, vw * 0.62)));

  return { spread, sceneH, maxSceneW };
}

function getHorizontalSpread(position: number, baseSpread: number): number {
  if (position >= 3.75) {
    const t = Math.min(1, (position - 3.75) / 1.25);
    return baseSpread + t * (baseSpread * 0.24);
  }
  return baseSpread;
}

function smoothstep(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return clamped * clamped * (3 - 2 * clamped);
}

function clampParallax(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

function getCarouselItemStyle(
  index: number,
  position: number,
  dragOffset: number,
  isNavigating: boolean,
  isDragging: boolean,
  baseSpread: number,
) {
  const offset = index - position;
  const absOffset = Math.abs(offset);

  // Only render the active cube + immediate neighbours (smooth edge fade beyond ±1).
  const neighborFade =
    absOffset <= 1.05 ? 1 : smoothstep(1 - (absOffset - 1.05) / 0.52);
  if (neighborFade < 0.015) {
    return {
      offset,
      focusT: 0,
      isCenter: false,
      visible: false,
      transform: "",
      opacity: 0,
      dim: 0,
      zIndex: 0,
      transition: "none",
      pointerEvents: "none" as const,
    };
  }

  const focusT = smoothstep(1 - absOffset / 0.68);
  const isCenter = focusT > 0.82;

  const spread = getHorizontalSpread(position, baseSpread);
  const translateZ = -95 + focusT * 125;
  const translateX = offset * spread + dragOffset * 0.4;
  const rotateY = offset * -9;
  const scale = 0.68 + focusT * 0.32;
  const sideLevel = 0.36;
  const opacity = neighborFade * (sideLevel + focusT * (1 - sideLevel));
  const dim = (1 - focusT) * 0.22;

  const useTransition = isNavigating && !isDragging;

  return {
    offset,
    focusT,
    isCenter,
    visible: true,
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity,
    dim,
    zIndex: Math.round(10 + focusT * 40),
    transition: useTransition
      ? "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1)"
      : "opacity 0.28s ease-out",
    pointerEvents: focusT > 0.45 ? ("auto" as const) : ("none" as const),
  };
}

/**
 * Horizontal 3D Rubik cube carousel — scroll position drives carousel 1:1 via live marker read.
 */
export function CapitalCubeCarousel({
  activeSectionIndex,
  scrollProgress,
  sizeMultiplier = 1.42,
  className = "",
}: CapitalCubeCarouselProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [metrics, setMetrics] = useState(getCarouselMetrics);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const parallaxTargetRef = useRef({ x: 0, y: 0 });
  const parallaxCurrentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onResize = () => setMetrics(getCarouselMetrics());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const target = parallaxTargetRef.current;
      const current = parallaxCurrentRef.current;
      const ease = 0.1;

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;

      if (
        Math.abs(current.x - target.x) > 0.001 ||
        Math.abs(current.y - target.y) > 0.001
      ) {
        setParallax({ x: current.x, y: current.y });
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const contextPosition = useMemo(() => {
    const raw = activeSectionIndex - 1 + scrollProgress;
    return Math.max(0, Math.min(CAPITALS_DATA.length - 1, raw));
  }, [activeSectionIndex, scrollProgress]);

  const position = useLiveCarouselPosition(contextPosition);

  const focusIdx = useMemo(
    () => Math.max(0, Math.min(CAPITALS_DATA.length - 1, Math.round(position))),
    [position],
  );

  const clearNavTimer = useCallback(() => {
    if (navTimerRef.current) {
      clearTimeout(navTimerRef.current);
      navTimerRef.current = null;
    }
  }, []);

  const navigateToCapital = useCallback(
    (index: number) => {
      if (!CAPITALS_DATA[index]) return;

      clearNavTimer();
      setIsNavigating(true);
      lockCarouselScrollSync(2000);
      scrollToCapitalMarker(index);

      const onScrollEnd = () => {
        unlockCarouselScrollSync();
        setIsNavigating(false);
        window.removeEventListener("scrollend", onScrollEnd);
      };

      if ("onscrollend" in window) {
        window.addEventListener("scrollend", onScrollEnd, { once: true });
      }

      navTimerRef.current = setTimeout(() => {
        unlockCarouselScrollSync();
        setIsNavigating(false);
        window.removeEventListener("scrollend", onScrollEnd);
      }, 2200);
    },
    [clearNavTimer],
  );

  const handlePrev = useCallback(() => {
    navigateToCapital(Math.max(0, focusIdx - 1));
  }, [focusIdx, navigateToCapital]);

  const handleNext = useCallback(() => {
    navigateToCapital(Math.min(CAPITALS_DATA.length - 1, focusIdx + 1));
  }, [focusIdx, navigateToCapital]);

  const finishDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    containerRef.current?.classList.remove("cursor-grabbing");

    if (dragOffset > 90) {
      handlePrev();
    } else if (dragOffset < -90) {
      handleNext();
    }
    setDragOffset(0);
  }, [dragOffset, handlePrev, handleNext]);

  useEffect(() => () => clearNavTimer(), [clearNavTimer]);

  const updateParallaxFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      parallaxTargetRef.current = {
        x: clampParallax(((clientX - rect.left) / rect.width - 0.5) * 2),
        y: clampParallax(((clientY - rect.top) / rect.height - 0.5) * 2),
      };
    },
    [],
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStartRef.current = e.clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
    containerRef.current?.classList.add("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateParallaxFromPointer(e.clientX, e.clientY);
    if (!isDraggingRef.current) return;
    setDragOffset(e.clientX - dragStartRef.current);
  };

  const handleSceneEnter = () => setIsHovering(true);

  const handleSceneLeave = useCallback(() => {
    setIsHovering(false);
    parallaxTargetRef.current = { x: 0, y: 0 };
    finishDrag();
  }, [finishDrag]);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
    updateParallaxFromPointer(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    updateParallaxFromPointer(e.touches[0].clientX, e.touches[0].clientY);
    if (!isDraggingRef.current) return;
    setDragOffset(e.touches[0].clientX - dragStartRef.current);
  };

  const sceneTiltX = parallax.y * -3.5;
  const sceneTiltY = parallax.x * 5;
  const perspectiveOriginX = 50 + parallax.x * 10;
  const perspectiveOriginY = 48 + parallax.y * 8;

  return (
    <div className={`relative flex h-full w-full flex-col ${className}`}>
      <div
        ref={containerRef}
        id="carousel-scene-root"
        onMouseDown={handleMouseDown}
        onMouseEnter={handleSceneEnter}
        onMouseMove={handleMouseMove}
        onMouseUp={finishDrag}
        onMouseLeave={handleSceneLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={finishDrag}
        className="relative flex min-h-0 flex-1 cursor-grab items-center justify-center overflow-visible py-2"
        style={{
          perspective: "1400px",
          perspectiveOrigin: `${perspectiveOriginX}% ${perspectiveOriginY}%`,
          transformStyle: "preserve-3d",
          height: `${metrics.sceneH}px`,
          width: "100%",
          maxWidth: `${metrics.maxSceneW}px`,
          transform: `rotateX(${sceneTiltX}deg) rotateY(${sceneTiltY}deg)`,
          transition: isDragging || isNavigating ? "none" : "transform 0.35s ease-out",
        }}
      >
        {CAPITALS_DATA.map((capital, index) => {
          const {
            focusT,
            transform,
            opacity,
            zIndex,
            visible,
            transition,
            dim,
            pointerEvents,
          } = getCarouselItemStyle(
            index,
            position,
            dragOffset,
            isNavigating,
            isDragging,
            metrics.spread,
          );

          if (!visible) return null;

          const hoverLift =
            focusT > 0.88 && isHovering && !isDragging ? 1.03 : 1;
          const glowOpacity = Math.max(0, (focusT - 0.55) / 0.45);
          const cubeParallax =
            focusT > 0.6
              ? { x: parallax.x * focusT, y: parallax.y * focusT }
              : { x: 0, y: 0 };

          return (
            <div
              key={capital.id}
              onClick={() => {
                if (index !== focusIdx) navigateToCapital(index);
              }}
              className="absolute flex items-center justify-center"
              style={{
                transform: `${transform} scale(${hoverLift})`,
                opacity,
                zIndex,
                transition,
                transformStyle: "preserve-3d",
                width: "280px",
                height: "320px",
                willChange: "transform, opacity",
                pointerEvents,
              }}
            >
              <div className="relative flex h-full w-full items-center justify-center">
                {glowOpacity > 0.06 && (
                  <div
                    className="pointer-events-none absolute -inset-12 rounded-full"
                    aria-hidden
                    style={{
                      opacity: glowOpacity * 0.85,
                      background:
                        "radial-gradient(circle, rgba(197,160,89,0.32) 0%, rgba(197,160,89,0.08) 45%, transparent 72%)",
                    }}
                  />
                )}

                {dim > 0.03 && (
                  <div
                    className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
                    aria-hidden
                    style={{
                      opacity: dim,
                      background:
                        "linear-gradient(145deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 100%)",
                    }}
                  />
                )}

                <RubikCube3D
                  mode="capital"
                  capitalIndex={capital.index}
                  sizeMultiplier={sizeMultiplier}
                  parallax={cubeParallax}
                  layerTwist={getCapitalCubeTwist(capital.index)}
                  assemblyOffset={getCapitalCubeAssembly(capital.index)}
                  faceImages={getCapitalCarouselCubeFaces(capital.index)}
                  className="relative z-10"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-30 mt-2 flex shrink-0 flex-col items-center gap-3">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={focusIdx === 0}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Previous capital"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2">
            {CAPITALS_DATA.map((capital, index) => {
              const distance = Math.abs(index - position);
              const dotFocus = smoothstep(1 - distance / 0.85);
              const isLit = dotFocus > 0.55;

              return (
                <button
                  key={capital.id}
                  type="button"
                  onClick={() => navigateToCapital(index)}
                  className="cursor-pointer rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: isLit ? 22 + dotFocus * 4 : 6,
                    height: 6,
                    backgroundColor: isLit
                      ? `rgba(197,160,89,${0.55 + dotFocus * 0.45})`
                      : "rgba(197,160,89,0.22)",
                    boxShadow: isLit
                      ? `0 0 ${8 + dotFocus * 6}px rgba(197,160,89,${0.25 + dotFocus * 0.35})`
                      : "none",
                    opacity: 0.45 + dotFocus * 0.55,
                  }}
                  aria-label={`Go to ${capital.id} capital`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            disabled={focusIdx === CAPITALS_DATA.length - 1}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30"
            aria-label="Next capital"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-500 capitalize">
          <span className="text-[#C5A059]">
            {CAPITALS_DATA[focusIdx]?.id ?? "financial"} Capital
          </span>
        </p>
      </div>
    </div>
  );
}
