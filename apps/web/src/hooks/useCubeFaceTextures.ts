import { useEffect, useMemo, useState } from "react";
import {
  CUBE_FACE_IMAGES,
  CUBE_FACE_ORDER,
  type CubeFaceName,
} from "@/features/capitals/capitalCubeFaceImages";

/** Preload cube textures — priority faces first, then the rest in parallel. */
export function useCubeFaceTextures(priorityFaces: CubeFaceName[] = []) {
  const [loaded, setLoaded] = useState<Set<CubeFaceName>>(() => new Set());

  const loadOrder = useMemo(() => {
    const priority = priorityFaces.filter((face) => face in CUBE_FACE_IMAGES);
    const rest = CUBE_FACE_ORDER.filter((face) => !priority.includes(face));
    return [...priority, ...rest];
  }, [priorityFaces]);

  useEffect(() => {
    let cancelled = false;

    const preloadOne = (face: CubeFaceName) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = CUBE_FACE_IMAGES[face].src;
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
  }, [loadOrder]);

  const allReady = loaded.size === CUBE_FACE_ORDER.length;

  return {
    loaded,
    allReady,
    isFaceLoaded: (face: CubeFaceName) => loaded.has(face),
  };
}
