import type { CubeLayerTwist, CubeAssemblyOffset } from "../cube-animation/utils/cubeRotationHelpers";

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  DEVELOPER KNOBS — each capital cube (1–6)                              │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Every value is in DEGREES. Change numbers only — no other code needed.
 *
 * ── assembly (whole 3D cube spin) ───────────────────────────────────────
 *    assembly.x  → tilt up / down
 *    assembly.y  → horizontal spin (left ↔ right)  ← main cube rotation
 *    assembly.z  → roll (clockwise / counter-clockwise)
 *
 * ── twist (Rubik layer slices — internal cubies) ─────────────────────────
 *    rowTop / rowMiddle / rowBottom   → horizontal rows
 *    colLeft / colMiddle / colRight   → vertical columns
 *    faceFront / faceMiddle / faceBack→ depth slices
 *
 * Keys: 1 Financial · 2 Manufactured · 3 Intellectual · 4 Human · 5 Social · 6 Natural
 */
export type { CubeAssemblyOffset } from "../cube-animation/utils/cubeRotationHelpers";

export interface CapitalCubeConfig {
  /** Whole-cube rotation added on top of the default capital pose. */
  assembly: CubeAssemblyOffset;
  /** Per-layer Rubik twists (optional slices). */
  twist: Partial<CubeLayerTwist>;
}

export const CAPITAL_CUBE_CONFIG: Record<number, CapitalCubeConfig> = {
  // 1 — Financial
  1: {
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
  },

  // 2 — Manufactured
  2: {
    assembly: { x: 0, y: 120, z: 0 },
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
  },

  // 4 — Human
  4: {
    assembly: { x: 60, y: 0, z: 20 },
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
  },

  // 6 — Natural
  6: {
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
  },
};

const EMPTY_ASSEMBLY: CubeAssemblyOffset = { x: 0, y: 0, z: 0 };

export function getCapitalCubeAssembly(capitalIndex: number): CubeAssemblyOffset {
  return CAPITAL_CUBE_CONFIG[capitalIndex]?.assembly ?? EMPTY_ASSEMBLY;
}

export function getCapitalCubeTwist(capitalIndex: number): Partial<CubeLayerTwist> {
  return CAPITAL_CUBE_CONFIG[capitalIndex]?.twist ?? {};
}
