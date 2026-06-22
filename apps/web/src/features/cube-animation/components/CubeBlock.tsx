import React from "react";
import { CubeSticker } from "./CubeSticker";
import { LayerAngles, getCubieTransformMatrix } from "../utils/cubeRotationHelpers";
import { useActiveSection } from "../../../context/ActiveSectionContext";

interface CubeBlockProps {
  cx: number; // -1, 0, 1
  cy: number; // -1, 0, 1
  cz: number; // -1, 0, 1
  layers: LayerAngles;
  cubieSize?: number;
  gap?: number;
  key?: string;
  activeSectionIndex: number;
  scrollProgress: number;
}

export const CubeBlock = React.memo(function CubeBlock({ 
  cx, 
  cy, 
  cz, 
  layers, 
  cubieSize = 72, 
  gap = 3,
  activeSectionIndex,
  scrollProgress
}: CubeBlockProps) {
  const halfSize = cubieSize / 2;

  // Compute the 3D translation & rotation for this specific sub-block using advanced kinematics
  const transformStyle = getCubieTransformMatrix(cx, cy, cz, activeSectionIndex, scrollProgress, cubieSize, gap);

  // Determine which faces of this block are on the exterior shell of the Rubik's Cube
  const hasFront = cz === 1;
  const hasBack = cz === -1;
  const hasLeft = cx === -1;
  const hasRight = cx === 1;
  const hasTop = cy === -1;
  const hasBottom = cy === 1;

  // Backface visibility styles for 3D faces
  const faceBaseStyle: React.CSSProperties = {
    position: "absolute",
    width: `${cubieSize}px`,
    height: `${cubieSize}px`,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
    // Base plastic color for the cubie
    backgroundColor: "#18181b", // zinc-900 matte plastic
    borderRadius: "10px",
    border: "2.5px solid #09090b", // zinc-950 black bezel
    boxSizing: "border-box",
  };

  return (
    <div
      className="absolute select-none pointer-events-none"
      style={{
        width: `${cubieSize}px`,
        height: `${cubieSize}px`,
        transformStyle: "preserve-3d",
        transform: transformStyle,
        left: `calc(50% - ${halfSize}px)`,
        top: `calc(50% - ${halfSize}px)`,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      {/* Front Face */}
      <div
        style={{
          ...faceBaseStyle,
          transform: `translateZ(${halfSize}px)`,
        }}
      >
        {hasFront ? (
          <CubeSticker face="front" x={cx} y={cy} z={cz} />
        ) : (
          <div className="w-full h-full bg-zinc-950"></div>
        )}
      </div>

      {/* Back Face */}
      <div
        style={{
          ...faceBaseStyle,
          transform: `translateZ(${-halfSize}px) rotateY(180deg)`,
        }}
      >
        {hasBack ? (
          <CubeSticker face="back" x={cx} y={cy} z={cz} />
        ) : (
          <div className="w-full h-full bg-zinc-950"></div>
        )}
      </div>

      {/* Left Face */}
      <div
        style={{
          ...faceBaseStyle,
          transform: `translateX(${-halfSize}px) rotateY(-90deg)`,
        }}
      >
        {hasLeft ? (
          <CubeSticker face="left" x={cz} y={cy} z={cx} />
        ) : (
          <div className="w-full h-full bg-zinc-950"></div>
        )}
      </div>

      {/* Right Face */}
      <div
        style={{
          ...faceBaseStyle,
          transform: `translateX(${halfSize}px) rotateY(90deg)`,
        }}
      >
        {hasRight ? (
          <CubeSticker face="right" x={cz} y={cy} z={cx} />
        ) : (
          <div className="w-full h-full bg-zinc-950"></div>
        )}
      </div>

      {/* Top Face */}
      <div
        style={{
          ...faceBaseStyle,
          transform: `translateY(${-halfSize}px) rotateX(90deg)`,
        }}
      >
        {hasTop ? (
          <CubeSticker face="top" x={cx} y={cz} z={cy} />
        ) : (
          <div className="w-full h-full bg-zinc-950"></div>
        )}
      </div>

      {/* Bottom Face */}
      <div
        style={{
          ...faceBaseStyle,
          transform: `translateY(${halfSize}px) rotateX(-90deg)`,
        }}
      >
        {hasBottom ? (
          <CubeSticker face="bottom" x={cx} y={cz} z={cy} />
        ) : (
          <div className="w-full h-full bg-zinc-950"></div>
        )}
      </div>
    </div>
  );
});
