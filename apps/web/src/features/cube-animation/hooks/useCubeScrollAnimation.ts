import { useEffect, useState } from "react";
import { useActiveSection } from "../../../context/ActiveSectionContext";
import { 
  getCubeAssemblyRotation, 
  getLayerRotations, 
  LayerAngles 
} from "../utils/cubeRotationHelpers";

export interface CubeAnimationValues {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  layers: LayerAngles;
  isSolved: boolean;
}

export function useCubeScrollAnimation(): CubeAnimationValues {
  const { activeSectionIndex, scrollProgress } = useActiveSection();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Mouse tracking offset for passive 3D depth floating with requestAnimationFrame throttling
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let pending = false;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const halfWidth = window.innerWidth / 2;
      const halfHeight = window.innerHeight / 2;
      // Get normal coordinate offset (-1.0 to 1.0)
      const nx = (e.clientX - halfWidth) / halfWidth;
      const ny = (e.clientY - halfHeight) / halfHeight;

      lastX = nx * 10;   // max 10 degrees tilt
      lastY = -ny * 10;  // max 10 degrees tilt

      if (!pending) {
        pending = true;
        rafId = requestAnimationFrame(() => {
          setMouseOffset({ x: lastX, y: lastY });
          pending = false;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Compute assembly base rotation
  const baseRotation = getCubeAssemblyRotation(activeSectionIndex, scrollProgress);

  // Compute layer rotators
  const layers = getLayerRotations(activeSectionIndex, scrollProgress);

  // Is the cube fully solved? Solved at final Alignment section (Index 7)
  const isSolved = activeSectionIndex >= 7;

  // Combine baseline scroll rotations with mouse tilts
  const finalX = baseRotation.x + mouseOffset.y;
  const finalY = baseRotation.y + mouseOffset.x;
  const finalZ = baseRotation.z;

  return {
    rotateX: finalX,
    rotateY: finalY,
    rotateZ: finalZ,
    layers,
    isSolved,
  };
}
