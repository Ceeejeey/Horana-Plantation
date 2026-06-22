import type { CubeLayerTwist } from "../cube-animation/utils/cubeRotationHelpers";

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  DEVELOPER KNOBS — rotate the rows / columns / faces of each capital cube │
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * Every value is in DEGREES. Just change the numbers — no other code needed.
 *
 *    0   = aligned (solved)        90  = quarter turn
 *    180 = half turn              -90  = quarter turn the other way
 *    360 = one full turn          45 / 30 / etc. = partial turns
 *
 * Which knob moves what:
 *
 *    rowTop / rowMiddle / rowBottom   → the 3 HORIZONTAL rows  (spin left↔right)
 *    colLeft / colMiddle / colRight   → the 3 VERTICAL columns (spin up↕down)
 *    faceFront / faceMiddle / faceBack→ the 3 DEPTH slices     (spin like a wheel)
 *
 * Keys are the capital index (1–6):
 *    1 Financial · 2 Manufactured · 3 Intellectual · 4 Human · 5 Social · 6 Natural
 *
 * Each cube is independent — edit one without touching the others. Leave a knob
 * out and it defaults to 0 (no rotation).
 */
export const CAPITAL_CUBE_TWISTS: Record<number, Partial<CubeLayerTwist>> = {
  // 1 — Financial
  1: {
    rowTop: 0,
    rowMiddle: 40,
    rowBottom: 0,
    colLeft: 0,
    colMiddle: 0,
    colRight: 0,
    faceFront: 0,
    faceMiddle: 0,
    faceBack: 0,
  },

  // 2 — Manufactured
  2: {
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

  // 3 — Intellectual
  3: {
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

  // 4 — Human
  4: {
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

  // 5 — Social & Relationship
  5: {
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

  // 6 — Natural
  6: {
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
};

/** Lookup helper — returns the twist for a capital, or an empty config. */
export function getCapitalCubeTwist(capitalIndex: number): Partial<CubeLayerTwist> {
  return CAPITAL_CUBE_TWISTS[capitalIndex] ?? {};
}
