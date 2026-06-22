import { useEffect, useMemo, useState } from "react";
import {
  CUBE_FACE_IMAGES,
  CUBE_FACE_ORDER,
  type CubeFaceName,
} from "@/features/capitals/capitalCubeFaceImages";

function getFaceSrc(
  face: CubeFaceName,
  faceOverrides?: Partial<Record<CubeFaceName, string>>,
): string | undefined {
  return faceOverrides?.[face] ?? CUBE_FACE_IMAGES[face]?.src;
}

/** Preload cube textures — priority faces first, then the rest in parallel. */
export function useCubeFaceTextures(
  priorityFaces: CubeFaceName[] = [],
  faceOverrides?: Partial<Record<CubeFaceName, string>>,
) {
  const [loaded, setLoaded] = useState<Set<CubeFaceName>>(() => new Set());

  const loadOrder = useMemo(() => {
    if (faceOverrides && Object.keys(faceOverrides).length > 0) {
      const overrideFaces = Object.keys(faceOverrides) as CubeFaceName[];
      const priority = priorityFaces.filter((face) => faceOverrides[face]);
      const rest = overrideFaces.filter((face) => !priority.includes(face));
      return [...priority, ...rest];
    }

    const priority = priorityFaces.filter((face) => face in CUBE_FACE_IMAGES);
    const rest = CUBE_FACE_ORDER.filter((face) => !priority.includes(face));
    return [...priority, ...rest];
  }, [priorityFaces, faceOverrides]);

  useEffect(() => {
    let cancelled = false;

    const preloadOne = (face: CubeFaceName) =>
      new Promise<void>((resolve) => {
        const src = getFaceSrc(face, faceOverrides);
        if (!src) {
          resolve();
          return;
        }

        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const run = async () => {
      const [first, ...remaining] = loadOrder;
      if (!first) return;

      await preloadOne(first);
      if (!cancelled) {
        setLoaded((prev) => new Set(prev).add(first));
      }

      await Promise.all(
        remaining.map(async (face) => {
          await preloadOne(face);
          if (!cancelled) {
            setLoaded((prev) => new Set(prev).add(face));
          }
        }),
      );
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [loadOrder, faceOverrides]);

  const allReady = loaded.size === loadOrder.length;

  return {
    loaded,
    allReady,
    isFaceLoaded: (face: CubeFaceName) => loaded.has(face),
  };
}
