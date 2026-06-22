import type { CubeLayerTwist, CubeAssemblyOffset } from "../cube-animation/utils/cubeRotationHelpers";
import type { CubeFaceName } from "./capitalCubeFaceImages";

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  CAROUSEL CUBE KNOBS — edit this file only                              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * ── CAROUSEL_CUBE_ASSEMBLY (shared by ALL 6 carousel cubes) ───────────────
 *    x  → tilt up / down
 *    y  → spin left ↔ right   ← main cube rotation
 *    z  → roll
 *
 * ── assembly per capital (1–6) ───────────────────────────────────────────
 *    Added ON TOP of CAROUSEL_CUBE_ASSEMBLY for that cube only.
 *    Edit x / y / z below — values are read directly at runtime.
 *
 * ── twist per capital ─────────────────────────────────────────────────────
 *    rowTop / rowMiddle / rowBottom   → horizontal rows
 *    colLeft / colMiddle / colRight   → vertical columns
 *    faceFront / faceMiddle / faceBack→ depth slices
 *
 * ── faces per capital (6 cube sides) ──────────────────────────────────────
 *    front / back / left / right / top / bottom
 *    • 1200×1200 JPG with 3×3 grid (one image per whole face)
 *    • Import a file below, then set it on the face — or paste a URL string
 *    • Omit a face (undefined) → black plastic only (no wrong image)
 *
 * Keys: 1 Financial · 2 Manufactured · 3 Intellectual · 4 Human · 5 Social · 6 Natural
 */

// ── Face image imports (`apps/web/src/assets/6 capital cube face/`) ─────────
import financialLeft from "@/assets/6 capital cube face/funcapital/left.jpg";
import financialRight from "@/assets/6 capital cube face/funcapital/right.jpg";
import financialTop from "@/assets/6 capital cube face/funcapital/top.jpg";

import manufacturedLeft from "@/assets/6 capital cube face/manufactured/left.jpg";
import manufacturedRight from "@/assets/6 capital cube face/manufactured/right.jpg";
import manufacturedTop from "@/assets/6 capital cube face/manufactured/top.jpg";

import intellectualLeft from "@/assets/6 capital cube face/intelectual/left.jpg";
import intellectualRight from "@/assets/6 capital cube face/intelectual/right.jpg";
import intellectualTop from "@/assets/6 capital cube face/intelectual/top.jpg";

import humanLeft from "@/assets/6 capital cube face/human/left.jpg";
import humanRight from "@/assets/6 capital cube face/human/right.jpg";
import humanTop from "@/assets/6 capital cube face/human/top.jpg";

import socialLeft from "@/assets/6 capital cube face/social/left.jpg";
import socialRight from "@/assets/6 capital cube face/social/right.jpg";
import socialTop from "@/assets/6 capital cube face/social/top.jpg";

import naturalLeft from "@/assets/6 capital cube face/natural/left.jpg";
import naturalRight from "@/assets/6 capital cube face/natural/right.jpg";
import naturalTop from "@/assets/6 capital cube face/natural/top.jpg";

export type { CubeAssemblyOffset } from "../cube-animation/utils/cubeRotationHelpers";

/** Set only the faces you want textured; omitted sides stay plastic. */
export type CapitalCubeFaces = Partial<Record<CubeFaceName, string>>;

export interface CapitalCubeConfig {
  /** Fine-tune added on top of CAROUSEL_CUBE_ASSEMBLY (degrees). */
  assembly: CubeAssemblyOffset;
  twist: Partial<CubeLayerTwist>;
  faces: CapitalCubeFaces;
}

/** Shared pose — all carousel cubes (edit x / y / z together). */
export const CAROUSEL_CUBE_ASSEMBLY: CubeAssemblyOffset = { x: -28, y: -52, z: 6 };

export const CAPITAL_CUBE_CONFIG: Record<number, CapitalCubeConfig> = {
  // 1 — Financial
  1: {
    assembly: { x: 14, y: 11, z: 0 },
    twist: {
      rowTop: 0,
      rowMiddle: 0,
      rowBottom: 0,
      colLeft: 0,
      colMiddle: 0,
      colRight: 0,
      faceFront: 0,
      faceMiddle: 0,
      faceBack: 0,
    },
    faces: {
      // front: undefined,
      // back: undefined,
      front: financialLeft,
      right: financialRight,
      top: financialTop,
      // bottom: undefined,
    },
  },

  // 2 — Manufactured
  2: {
    assembly: { x: 24, y: 277, z: 0 },
    twist: {
      rowTop: 0,
      rowMiddle: 0,
      rowBottom: 0,
      colLeft: 0,
      colMiddle: 50,
      colRight: 0,
      faceFront: 0,
      faceMiddle: 0,
      faceBack: 0,
    },
    faces: {
      right: manufacturedLeft,
      back: manufacturedRight,
      top: manufacturedTop,
      // bottom: undefined,
      // front: undefined,
      // back: undefined,

    },
  },

  // 3 — Intellectual
  3: {
    assembly: { x: 0, y: 0, z: 0 },
    twist: {
      rowTop: 0,
      rowMiddle: 0,
      rowBottom: 0,
      colLeft: 0,
      colMiddle: 0,
      colRight: 0,
      faceFront: 0,
      faceMiddle: 0,
      faceBack: 0,
    },
    faces: {
      front: intellectualLeft,
      right: intellectualRight,
      top: intellectualTop,
      // bottom: undefined,
      // front: undefined,
      // back: undefined,
    },
  },

  // 4 — Human
  4: {
    assembly: { x: 20, y: 409, z: 0 },
    twist: {
      rowTop: -30,
      rowMiddle: 0,
      rowBottom: -30,
      colLeft: 0,
      colMiddle: 0,
      colRight: 0,
      faceFront: 0,
      faceMiddle: 0,
      faceBack: 0,
    },
    faces: {
      front: humanLeft,
      right: humanRight,
      top: humanTop,
      // bottom: undefined,
      // front: undefined,
      // back: undefined,
    },
  },

  // 5 — Social & Relationship
  5: {
    assembly: { x: 0, y: 0, z: 0 },
    twist: {
      rowTop: 0,
      rowMiddle: 0,
      rowBottom: 0,
      colLeft: 0,
      colMiddle: 0,
      colRight: 0,
      faceFront: 0,
      faceMiddle: 0,
      faceBack: 0,
    },
    faces: {
      front: socialLeft,
      right: socialRight,
      top: socialTop,
      // bottom: undefined,
      // front: undefined,
      // back: undefined,
    },
  },

  // 6 — Natural
  6: {
    assembly: { x: 22, y: 4, z: 0 },
    twist: {
      rowTop: 0,
      rowMiddle: 0,
      rowBottom: 0,
      colLeft: 0,
      colMiddle: 0,
      colRight: 0,
      faceFront: 0,
      faceMiddle: 40,
      faceBack: 0,
    },
    faces: {
      front: naturalLeft,
      right: naturalRight,
      top: naturalTop,
      // bottom: undefined,
      // front: undefined,
      // back: undefined,
    },
  },
};

const EMPTY_ASSEMBLY: CubeAssemblyOffset = { x: 0, y: 0, z: 0 };
const EMPTY_FACES: CapitalCubeFaces = {};

export function getCapitalCubeAssembly(capitalIndex: number): CubeAssemblyOffset {
  return CAPITAL_CUBE_CONFIG[capitalIndex]?.assembly ?? EMPTY_ASSEMBLY;
}

export function getCapitalCubeTwist(capitalIndex: number): Partial<CubeLayerTwist> {
  return CAPITAL_CUBE_CONFIG[capitalIndex]?.twist ?? {};
}

/** Only faces with a non-empty src are returned — others stay plastic on the cube. */
export function getCapitalCubeFaceImages(capitalIndex: number): CapitalCubeFaces {
  const faces = CAPITAL_CUBE_CONFIG[capitalIndex]?.faces ?? EMPTY_FACES;
  return Object.fromEntries(
    Object.entries(faces).filter(
      (entry): entry is [CubeFaceName, string] =>
        typeof entry[1] === "string" && entry[1].length > 0,
    ),
  );
}

/** @deprecated Use getCapitalCubeFaceImages */
export const getCapitalCarouselCubeFaces = getCapitalCubeFaceImages;
