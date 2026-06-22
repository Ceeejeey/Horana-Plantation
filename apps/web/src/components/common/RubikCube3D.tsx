import React, { useEffect, useMemo, useState } from "react";
import {
  getCubieTransformMatrix,
  getSolvedCubieTransformMatrix,
  getTwistedCubieTransformMatrix,
  hasActiveTwist,
  getCapitalAssemblyRotation,
  getLayerRotations,
  getCubeAssemblyRotation,
  type LayerAngles,
  type CubeLayerTwist,
} from "../../features/cube-animation/utils/cubeRotationHelpers";
import {
  CUBE_FACE_IMAGES,
  CUBE_FACE_ORDER,
  type CubeFaceName,
} from "../../features/capitals/capitalCubeFaceImages";
import { useCubeFaceTextures } from "../../hooks/useCubeFaceTextures";

/** Fixed isometric camera — front + top + right faces visible. */
const ISO_CAMERA = { x: -28, y: 38, z: 6 };

export type RubikCubeMode = "loading" | "interactive" | "solved" | "scroll" | "capital";

export interface RubikCube3DProps {
  /** `loading` = auto-solve timeline; `interactive` = pointer parallax; `solved` = static display; `scroll` = page scroll drive; `capital` = fixed pose per capital */
  mode?: RubikCubeMode;
  /** 0–1 layer solve progress (used by loading screen progress bar) */
  solveProgress?: number;
  /** 1–6 capital index when `mode="capital"` */
  capitalIndex?: number;
  sizeMultiplier?: number;
  className?: string;
  parallax?: { x: number; y: number };
  scrollSectionIndex?: number;
  scrollSectionProgress?: number;
  /** Per-row / column / face twist (degrees) applied in `mode="capital"`. */
  layerTwist?: Partial<CubeLayerTwist>;
}

type FaceName = CubeFaceName;

const CAPITAL_INDEX_TO_FACE: CubeFaceName[] = CUBE_FACE_ORDER;

function ImageSticker({
  face,
  gridX,
  gridY,
  visible,
  textureReady,
}: {
  face: FaceName;
  gridX: number;
  gridY: number;
  visible: boolean;
  textureReady: boolean;
}) {
  const asset = CUBE_FACE_IMAGES[face];
  const posX = ((gridX + 1) / 2) * 100;
  const posY = ((gridY + 1) / 2) * 100;

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[5px]"
      style={{
        backgroundImage: visible && textureReady ? `url(${asset.src})` : undefined,
        backgroundSize: "300% 300%",
        backgroundPosition: `${posX}% ${posY}%`,
        backgroundRepeat: "no-repeat",
      }}
      role="img"
      aria-label={asset.label}
    >
      <div className="pointer-events-none h-full w-full bg-linear-to-br from-white/15 via-transparent to-black/45" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/50" />
    </div>
  );
}

const CUBIE_COORDS: { x: number; y: number; z: number }[] = [];
for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      if (x === 0 && y === 0 && z === 0) continue;
      CUBIE_COORDS.push({ x, y, z });
    }
  }
}

/** Drives 0→1 solve progress on a timer (e.g. for demos). */
export function useRubikSolveProgress(durationMs: number, active = true): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setProgress(t);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, active]);

  return progress;
}

function useContinuousSpin(active: boolean, degPerSecond = 52): number {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      setAngle(((now - start) / 1000) * degPerSecond);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, degPerSecond]);

  return angle;
}

function useCubieSize(multiplier = 1): number {
  const [base, setBase] = useState(36);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 400) setBase(32);
      else if (w < 640) setBase(38);
      else if (w < 1024) setBase(44);
      else setBase(50);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return Math.round(base * multiplier);
}

const PhotoCubeBlock = React.memo(function PhotoCubeBlock({
  cx,
  cy,
  cz,
  cubieSize = 72,
  gap = 3,
  activeSectionIndex,
  scrollProgress,
  capitalPose,
  layerTwist,
  isFaceLoaded,
}: {
  cx: number;
  cy: number;
  cz: number;
  layers: LayerAngles;
  cubieSize?: number;
  gap?: number;
  activeSectionIndex: number;
  scrollProgress: number;
  capitalPose?: boolean;
  layerTwist?: Partial<CubeLayerTwist>;
  isFaceLoaded: (face: FaceName) => boolean;
}) {
  const halfSize = cubieSize / 2;
  const transformStyle = capitalPose
    ? hasActiveTwist(layerTwist)
      ? getTwistedCubieTransformMatrix(cx, cy, cz, layerTwist!, cubieSize, gap)
      : getSolvedCubieTransformMatrix(cx, cy, cz, cubieSize, gap)
    : getCubieTransformMatrix(cx, cy, cz, activeSectionIndex, scrollProgress, cubieSize, gap);

  const hasFront = cz === 1;
  const hasBack = cz === -1;
  const hasLeft = cx === -1;
  const hasRight = cx === 1;
  const hasTop = cy === -1;
  const hasBottom = cy === 1;

  const faceBaseStyle: React.CSSProperties = {
    position: "absolute",
    width: `${cubieSize}px`,
    height: `${cubieSize}px`,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transformStyle: "preserve-3d",
    WebkitTransformStyle: "preserve-3d",
    overflow: "hidden",
    backgroundColor: "#18181b",
    borderRadius: "8px",
    border: "2px solid #09090b",
    boxSizing: "border-box",
  };

  const plastic = <div className="h-full w-full bg-zinc-950" />;

  return (
    <div
      className="pointer-events-none absolute select-none"
      style={{
        width: `${cubieSize}px`,
        height: `${cubieSize}px`,
        transformStyle: "preserve-3d",
        WebkitTransformStyle: "preserve-3d",
        transform: transformStyle,
        willChange: "transform",
        left: `calc(50% - ${halfSize}px)`,
        top: `calc(50% - ${halfSize}px)`,
      }}
    >
      <div style={{ ...faceBaseStyle, transform: `translateZ(${halfSize}px)` }}>
        {hasFront ? (
          <ImageSticker
            face="front"
            gridX={cx}
            gridY={cy}
            visible={hasFront}
            textureReady={isFaceLoaded("front")}
          />
        ) : (
          plastic
        )}
      </div>
      <div style={{ ...faceBaseStyle, transform: `translateZ(${-halfSize}px) rotateY(180deg)` }}>
        {hasBack ? (
          <ImageSticker
            face="back"
            gridX={cx}
            gridY={cy}
            visible={hasBack}
            textureReady={isFaceLoaded("back")}
          />
        ) : (
          plastic
        )}
      </div>
      <div style={{ ...faceBaseStyle, transform: `translateX(${-halfSize}px) rotateY(-90deg)` }}>
        {hasLeft ? (
          <ImageSticker
            face="left"
            gridX={cz}
            gridY={cy}
            visible={hasLeft}
            textureReady={isFaceLoaded("left")}
          />
        ) : (
          plastic
        )}
      </div>
      <div style={{ ...faceBaseStyle, transform: `translateX(${halfSize}px) rotateY(90deg)` }}>
        {hasRight ? (
          <ImageSticker
            face="right"
            gridX={cz}
            gridY={cy}
            visible={hasRight}
            textureReady={isFaceLoaded("right")}
          />
        ) : (
          plastic
        )}
      </div>
      <div style={{ ...faceBaseStyle, transform: `translateY(${-halfSize}px) rotateX(90deg)` }}>
        {hasTop ? (
          <ImageSticker
            face="top"
            gridX={cx}
            gridY={cz}
            visible={hasTop}
            textureReady={isFaceLoaded("top")}
          />
        ) : (
          plastic
        )}
      </div>
      <div style={{ ...faceBaseStyle, transform: `translateY(${halfSize}px) rotateX(-90deg)` }}>
        {hasBottom ? (
          <ImageSticker
            face="bottom"
            gridX={cx}
            gridY={cz}
            visible={hasBottom}
            textureReady={isFaceLoaded("bottom")}
          />
        ) : (
          plastic
        )}
      </div>
    </div>
  );
});

/**
 * Shared 3×3 photo Rubik's cube with layer-by-layer solve animation.
 * Use on the loading screen (`mode="loading"`) and coming soon page (`mode="interactive"`).
 */
export function RubikCube3D({
  mode = "solved",
  solveProgress: externalSolveProgress,
  capitalIndex = 1,
  sizeMultiplier = 1,
  className = "",
  parallax = { x: 0, y: 0 },
  scrollSectionIndex = 0,
  scrollSectionProgress = 0,
  layerTwist,
}: RubikCube3DProps) {
  const isLoading = mode === "loading";
  const isInteractive = mode === "interactive";
  const isSolved = mode === "solved";
  const isScroll = mode === "scroll";
  const isCapital = mode === "capital";

  const cubieSize = useCubieSize(sizeMultiplier);
  const gap = 3;

  const priorityFaces = useMemo((): CubeFaceName[] => {
    if (isCapital) {
      const primary = CAPITAL_INDEX_TO_FACE[Math.min(6, Math.max(1, capitalIndex)) - 1];
      return [primary, "front", "right", "top"];
    }
    return ["front", "right", "top"];
  }, [isCapital, capitalIndex]);

  const { isFaceLoaded } = useCubeFaceTextures(priorityFaces);
  const spinY = useContinuousSpin(isInteractive, 22);

  const solveProgress = externalSolveProgress ?? (isSolved || isInteractive ? 1 : 0);

  /** Loading: start scrambled (t=1) → fully solved (t=7) over solveProgress 0→1. */
  const cubeT = useMemo(() => {
    if (isCapital) return 7;
    if (isScroll) return scrollSectionIndex + scrollSectionProgress;
    if (!isLoading) return 7;
    return 1 + solveProgress * 6;
  }, [isCapital, isLoading, isScroll, scrollSectionIndex, scrollSectionProgress, solveProgress]);
  const activeSectionIndex = Math.floor(cubeT);
  const scrollProgress = cubeT - activeSectionIndex;

  const layers = useMemo(
    () => getLayerRotations(activeSectionIndex, scrollProgress),
    [activeSectionIndex, scrollProgress],
  );

  const assembly = useMemo(() => {
    if (isCapital) {
      const clamped = Math.min(6, Math.max(1, capitalIndex));
      return getCapitalAssemblyRotation(clamped, parallax);
    }

    if (isScroll) {
      const base = getCubeAssemblyRotation(scrollSectionIndex, scrollSectionProgress);
      return {
        x: base.x - parallax.y * 5,
        y: base.y + parallax.x * 8,
        z: base.z + parallax.x * 2,
      };
    }

    if (isInteractive || isSolved) {
      const breathe = Math.sin((spinY * Math.PI) / 180) * 1.5;
      return {
        x: ISO_CAMERA.x + breathe - parallax.y * 6,
        y: ISO_CAMERA.y + spinY * (isInteractive ? 0.35 : 0.12) + parallax.x * 10,
        z: ISO_CAMERA.z + parallax.x * 2,
      };
    }

    const breathe = Math.sin(solveProgress * Math.PI * 4) * 1.8;
    const orbit = solveProgress * 68;
    return {
      x: ISO_CAMERA.x + breathe,
      y: ISO_CAMERA.y + orbit,
      z: ISO_CAMERA.z,
    };
  }, [isCapital, capitalIndex, isInteractive, isSolved, isScroll, isLoading, parallax.x, parallax.y, spinY, solveProgress, scrollSectionIndex, scrollSectionProgress]);

  const cubeExtent = cubieSize * 3 + gap * 2;
  const stage = cubeExtent + 120;
  const perspectivePx = isCapital ? 1200 : 900;

  return (
    <>
      <style>{rubikCubeStyles}</style>
      <div
        className={`rubik-cube-stage relative flex items-center justify-center ${className}`}
        style={{
          width: stage,
          height: stage,
          perspective: `${perspectivePx}px`,
          perspectiveOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          WebkitTransformStyle: "preserve-3d",
        }}
        aria-hidden={isLoading}
      >
        {!isCapital && (
          <>
            <div
              className={`pointer-events-none absolute rounded-full blur-3xl ${
                isInteractive || isSolved || isScroll ? "h-[135%] w-[135%] bg-[#C5A059]/16" : "h-full w-full bg-[#C5A059]/14"
              }`}
            />
            <div
              className={`pointer-events-none absolute rounded-full border border-dashed border-emerald-500/15 ${
                isLoading
                  ? "rubik-cube-orbit rubik-cube-orbit--fast h-[112%] w-[112%]"
                  : "rubik-cube-orbit h-[120%] w-[120%]"
              }`}
            />
          </>
        )}

        <div
          className="rubik-cube-perspective relative flex items-center justify-center"
          style={{
            width: cubeExtent,
            height: cubeExtent,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
          }}
        >
          {isLoading && (
            <div
              className="rubik-cube-glow-pulse pointer-events-none absolute inset-0 rounded-full"
              aria-hidden
            />
          )}
          <div
            className="rubik-cube-assembly relative"
            style={{
              width: cubeExtent,
              height: cubeExtent,
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
              transform: `translateZ(0) rotateX(${assembly.x}deg) rotateY(${assembly.y}deg) rotateZ(${assembly.z}deg)`,
              willChange: "transform",
            }}
          >
            {CUBIE_COORDS.map((coord) => (
              <PhotoCubeBlock
                key={`${coord.x}-${coord.y}-${coord.z}`}
                cx={coord.x}
                cy={coord.y}
                cz={coord.z}
                layers={layers}
                cubieSize={cubieSize}
                gap={gap}
                activeSectionIndex={activeSectionIndex}
                scrollProgress={scrollProgress}
                capitalPose={isCapital}
                layerTwist={layerTwist}
                isFaceLoaded={isFaceLoaded}
              />
            ))}
          </div>

          {!isCapital && (
            <div
              className="pointer-events-none absolute left-1/2 top-[75%] h-12 w-full -translate-x-1/2 rounded-[100%] bg-black/65 blur-2xl"
              style={{
                transform: "translateX(-50%) translateZ(-120px) rotateX(90deg)",
                transformStyle: "preserve-3d",
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

/** @deprecated Use `RubikCube3D` */
export const RubikCubeScene = RubikCube3D;

const rubikCubeStyles = `
  @keyframes rubik-cube-orbit-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes rubik-cube-float {
    0%, 100% { transform: rotateX(-22deg) rotateY(15deg) translateY(0); }
    50% { transform: rotateX(-16deg) rotateY(28deg) translateY(-8px); }
  }
  @keyframes rubik-cube-glow-pulse {
    0%, 100% { opacity: 0.35; transform: scale(0.92); }
    50% { opacity: 0.65; transform: scale(1.05); }
  }
  .rubik-cube-perspective,
  .rubik-cube-assembly,
  .rubik-cube-stage {
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .rubik-cube-assembly > * {
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .rubik-cube-glow-pulse {
    background: radial-gradient(circle, rgba(197, 160, 89, 0.22) 0%, transparent 70%);
    animation: rubik-cube-glow-pulse 1.8s ease-in-out infinite;
    transform-style: flat;
  }
  .rubik-cube-orbit { animation: rubik-cube-orbit-spin 52s linear infinite; }
  .rubik-cube-orbit--fast { animation: rubik-cube-orbit-spin 9s linear infinite; }
  @media (prefers-reduced-motion: reduce) {
    .rubik-cube-orbit, .rubik-cube-orbit--fast, .rubik-cube-glow-pulse { animation: none; }
  }
`;
