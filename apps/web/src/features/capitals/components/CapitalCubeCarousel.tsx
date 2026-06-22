import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CAPITALS_DATA } from "../capitalsData";
import { getCapitalCubeTwist, getCapitalCubeAssembly } from "../capitalCubeTwists";
import { RubikCube3D } from "../../../components/common/RubikCube3D";
import { useActiveSection } from "../../../context/ActiveSectionContext";
import {
  SERIES_ANCHOR_Y,
  computeCarouselPositionFromMarkers,
} from "../../../hooks/useScrollSpy";
import {
  lockCarouselScrollSync,
  unlockCarouselScrollSync,
} from "../carouselSyncLock";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CapitalCubeCarouselProps {
  activeSectionIndex: number;
  scrollProgress: number;
  sizeMultiplier?: number;
  className?: string;
}

function getSeriesMarkerTops(): number[] | null {
  const tops = CAPITALS_DATA.map((c) => {
    const el = document.getElementById(`${c.id}-series-marker`);
    return el ? el.getBoundingClientRect().top : null;
  });
  return tops.some((t) => t === null) ? null : (tops as number[]);
}

function applyCarouselPosition(
  position: number,
  setActiveSection: (index: number, progress: number) => void,
) {
  const clamped = Math.max(0, Math.min(CAPITALS_DATA.length - 1, position));
  setActiveSection(Math.floor(clamped) + 1, clamped - Math.floor(clamped));
}

function scrollToCapital(
  index: number,
  setActiveSection: (index: number, progress: number) => void,
) {
  const capital = CAPITALS_DATA[index];
  if (!capital) return;

  const marker = document.getElementById(`${capital.id}-series-marker`);
  const section = document.getElementById(capital.id);

  if (!marker || !section) {
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const markerTop = marker.getBoundingClientRect().top;
  const targetY = window.scrollY + markerTop - SERIES_ANCHOR_Y;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clampedTarget = Math.min(Math.max(0, targetY), maxScroll);
  const hitScrollLimit = clampedTarget + 12 < targetY;

  window.scrollTo({ top: clampedTarget, behavior: "smooth" });

  const started = Date.now();
  const settle = () => {
    const tops = getSeriesMarkerTops();
    const livePosition = tops ? computeCarouselPositionFromMarkers(tops) : -1;
    const markerEl = document.getElementById(`${capital.id}-series-marker`);
    const top = markerEl?.getBoundingClientRect().top ?? 9999;
    const sectionTop = section.getBoundingClientRect().top;

    if (tops) {
      applyCarouselPosition(computeCarouselPositionFromMarkers(tops), setActiveSection);
    }

    const markerSettled =
      Math.abs(livePosition - index) < 0.06 || Math.abs(top - SERIES_ANCHOR_Y) < 16;
    const limitSettled =
      hitScrollLimit &&
      index === CAPITALS_DATA.length - 1 &&
      sectionTop <= SERIES_ANCHOR_Y + 32;

    if (markerSettled || limitSettled || Date.now() - started > 4500) {
      if (limitSettled || (markerSettled && Math.abs(livePosition - index) < 0.06)) {
        setActiveSection(capital.index, 0);
      }

      unlockCarouselScrollSync();
      ScrollTrigger.update();
      return;
    }
    requestAnimationFrame(settle);
  };
  requestAnimationFrame(settle);
}

function getHorizontalSpread(position: number): number {
  // Extra breathing room for Social ↔ Natural — last segment has no trailing neighbor cube
  if (position >= 3.75) {
    const t = Math.min(1, (position - 3.75) / 1.25);
    return 220 + t * 55;
  }
  return 220;
}

function getCarouselItemStyle(
  index: number,
  position: number,
  dragOffset: number,
  isDragging: boolean,
  isScrubbing: boolean,
) {
  const offset = index - position;
  const isCenter = Math.abs(offset) < 0.5;
  const spread = getHorizontalSpread(position);
  const rotationY = offset * 25;
  const translateZ = isCenter ? 30 : -100;
  const translateX = offset * spread + dragOffset * 0.4;
  let opacity = isCenter ? 1 : Math.max(0.28, 0.75 - Math.abs(offset) * 0.32);
  let scale = isCenter ? 1.0 : position >= 4 ? 0.78 : 0.82;

  if (Math.abs(offset) > 1.8) {
    opacity = 0;
    scale = 0.5;
  }

  const inView = Math.abs(offset) <= 1.15;

  return {
    offset,
    isCenter,
    inView,
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotationY}deg) scale(${scale})`,
    opacity,
    zIndex: isCenter ? 50 : 30 - Math.abs(offset),
    transition:
      isDragging || isScrubbing
        ? "none"
        : "transform 0.55s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.55s cubic-bezier(0.25, 1, 0.5, 1)",
  };
}

/**
 * 3D perspective carousel — vertical scroll scrubs position; drag/arrows scroll to capital sections.
 */
export function CapitalCubeCarousel({
  activeSectionIndex,
  scrollProgress,
  sizeMultiplier = 1.42,
  className = "",
}: CapitalCubeCarouselProps) {
  const { setActiveSection } = useActiveSection();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef(0);
  const isDraggingRef = useRef(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Smooth mouse-driven parallax tilt for the focused cube.
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const parallaxTarget = useRef({ x: 0, y: 0 });
  const parallaxCurrent = useRef({ x: 0, y: 0 });
  const parallaxRaf = useRef<number | null>(null);

  const stepParallax = useCallback(() => {
    const cur = parallaxCurrent.current;
    const tgt = parallaxTarget.current;
    const nx = cur.x + (tgt.x - cur.x) * 0.12;
    const ny = cur.y + (tgt.y - cur.y) * 0.12;
    parallaxCurrent.current = { x: nx, y: ny };

    if (Math.abs(tgt.x - nx) > 0.0015 || Math.abs(tgt.y - ny) > 0.0015) {
      setParallax({ x: nx, y: ny });
      parallaxRaf.current = requestAnimationFrame(stepParallax);
    } else {
      parallaxCurrent.current = { x: tgt.x, y: tgt.y };
      setParallax({ x: tgt.x, y: tgt.y });
      parallaxRaf.current = null;
    }
  }, []);

  const ensureParallaxLoop = useCallback(() => {
    if (parallaxRaf.current == null) {
      parallaxRaf.current = requestAnimationFrame(stepParallax);
    }
  }, [stepParallax]);

  useEffect(
    () => () => {
      if (parallaxRaf.current != null) cancelAnimationFrame(parallaxRaf.current);
    },
    [],
  );

  const position = useMemo(() => {
    const raw = activeSectionIndex - 1 + scrollProgress;
    return Math.max(0, Math.min(CAPITALS_DATA.length - 1, raw));
  }, [activeSectionIndex, scrollProgress]);

  // Locked capital index — must match left column (capital.index === activeSectionIndex).
  const focusIdx = useMemo(() => {
    if (activeSectionIndex < 1) return 0;
    if (activeSectionIndex > CAPITALS_DATA.length) return CAPITALS_DATA.length - 1;
    return activeSectionIndex - 1;
  }, [activeSectionIndex]);

  const isScrubbing = scrollProgress > 0.04 && scrollProgress < 0.96;

  const navigateToCapital = useCallback(
    (index: number) => {
      const capital = CAPITALS_DATA[index];
      if (!capital) return;

      lockCarouselScrollSync(4500);

      scrollToCapital(index, setActiveSection);
    },
    [setActiveSection],
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStartRef.current = e.clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
    containerRef.current?.classList.add("cursor-grabbing");
  };

  const updateParallaxFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = ((clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((clientY - rect.top) / rect.height - 0.5) * 2;
      parallaxTarget.current = {
        x: Math.max(-1, Math.min(1, px)),
        y: Math.max(-1, Math.min(1, py)),
      };
      ensureParallaxLoop();
    },
    [ensureParallaxLoop],
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) {
      updateParallaxFromPointer(e.clientX, e.clientY);
      return;
    }
    setDragOffset(e.clientX - dragStartRef.current);
  };

  const handleSceneEnter = () => setIsHovering(true);

  const handleSceneLeave = useCallback(() => {
    setIsHovering(false);
    parallaxTarget.current = { x: 0, y: 0 };
    ensureParallaxLoop();
    finishDrag();
  }, [ensureParallaxLoop, finishDrag]);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    setDragOffset(e.touches[0].clientX - dragStartRef.current);
  };

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
          perspective: "1200px",
          perspectiveOrigin: "center center",
          transformStyle: "preserve-3d",
          height: "440px",
          width: "100%",
          maxWidth: position >= 3.75 ? "860px" : "720px",
        }}
      >
        {CAPITALS_DATA.map((capital, index) => {
          const { isCenter, transform, opacity, zIndex, inView, transition } =
            getCarouselItemStyle(index, position, dragOffset, isDragging, isScrubbing);

          if (!inView) return null;

          const cubeParallax = isCenter
            ? { x: parallax.x * 1.45, y: parallax.y * 1.45 }
            : { x: parallax.x * 0.55, y: parallax.y * 0.55 };

          const hoverScale = isCenter && isHovering && !isDragging ? 1.04 : 1;

          return (
            <div
              key={capital.id}
              onClick={() => {
                if (index !== focusIdx) navigateToCapital(index);
              }}
              className="absolute flex items-center justify-center pointer-events-auto"
              style={{
                transform: `${transform} scale(${hoverScale})`,
                opacity,
                zIndex,
                transition,
                transformStyle: "preserve-3d",
                width: "280px",
                height: "320px",
                willChange: "transform, opacity",
              }}
            >
              <RubikCube3D
                mode="capital"
                capitalIndex={capital.index}
                sizeMultiplier={sizeMultiplier}
                parallax={cubeParallax}
                layerTwist={getCapitalCubeTwist(capital.index)}
                assemblyOffset={getCapitalCubeAssembly(capital.index)}
                className="relative z-10"
              />
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
              const lit = index === focusIdx;
              return (
                <button
                  key={capital.id}
                  type="button"
                  onClick={() => navigateToCapital(index)}
                  className="cursor-pointer rounded-full transition-all"
                  style={{
                    width: lit ? 24 : 6,
                    height: 6,
                    backgroundColor: lit ? "#C5A059" : "rgba(197,160,89,0.22)",
                    boxShadow: lit ? "0 0 10px rgba(197,160,89,0.45)" : "none",
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

        <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-zinc-500">
          <span className="text-[#C5A059]">0{focusIdx + 1}</span>
          <span className="mx-2 text-zinc-700">/</span>
          <span>06</span>
          <span className="mx-3 text-zinc-700">·</span>
          <span className="capitalize text-zinc-400">
            {CAPITALS_DATA[focusIdx]?.id ?? "financial"} capital
          </span>
        </p>
      </div>
    </div>
  );
}
