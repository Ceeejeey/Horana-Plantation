export interface LayerAngles {
  top: number;    // y = -1
  middleY: number; // y = 0
  bottom: number; // y = 1
  left: number;   // x = -1
  middleX: number; // x = 0
  right: number;  // x = 1
  front: number;  // z = 1
  middleZ: number; // z = 0
  back: number;   // z = -1
}

/**
 * Developer-facing per-layer twist, in DEGREES. Each value rotates one slice of
 * the 3×3 cube. 0 = aligned, 90 = quarter turn, 180 = half, 360 = full turn.
 *
 *  rows  → horizontal slices, spin around the vertical Y axis
 *  cols  → vertical slices,   spin around the horizontal X axis
 *  faces → depth slices,      spin around the Z axis (toward/away from viewer)
 */
export interface CubeLayerTwist {
  rowTop: number;     // y = -1 (top horizontal row)
  rowMiddle: number;  // y =  0 (middle horizontal row)
  rowBottom: number;  // y =  1 (bottom horizontal row)
  colLeft: number;    // x = -1 (left vertical column)
  colMiddle: number;  // x =  0 (middle vertical column)
  colRight: number;   // x =  1 (right vertical column)
  faceFront: number;  // z =  1 (front depth slice)
  faceMiddle: number; // z =  0 (middle depth slice)
  faceBack: number;   // z = -1 (back depth slice)
}

export const ZERO_CUBE_TWIST: CubeLayerTwist = {
  rowTop: 0,
  rowMiddle: 0,
  rowBottom: 0,
  colLeft: 0,
  colMiddle: 0,
  colRight: 0,
  faceFront: 0,
  faceMiddle: 0,
  faceBack: 0,
};

export type Vector3 = { x: number; y: number; z: number };
export type Matrix3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

/** Smooth 0→1 easing for layer turns and loading progress. */
export function easeInOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeLayerSegment(local: number): number {
  return easeInOutCubic(local);
}

// Scramble angles in degrees for each layer (fallback values)
export const SCRAMBLE_TIMELINE = {
  top: 90,
  middleY: 0,
  bottom: -90,
  left: -90,
  middleX: 0,
  right: 90,
  front: 90,
  middleZ: 0,
  back: -90,
};

/**
 * Returns the target angles of the entire cube assembly for a given section index.
 */
export function getCubeAssemblyRotation(sectionIndex: number, progressProgress: number): { x: number; y: number; z: number } {
  const angles = [
    { x: -20, y: 35, z: 0 },    // 0: Hero (Scenic view)
    { x: 5, y: -10, z: 0 },     // 1: Financial (Front close focus)
    { x: 10, y: -100, z: 0 },   // 2: Manufactured (Right focus)
    { x: -85, y: -10, z: -10 },  // 3: Intellectual (Top focus)
    { x: 10, y: 80, z: 0 },     // 4: Human (Left focus)
    { x: 80, y: 15, z: 10 },    // 5: Social & Relationship (Bottom focus)
    { x: 10, y: -190, z: 0 },   // 6: Natural (Back focus)
    { x: -25, y: 385, z: 15 },  // 7: Final Alignment (Solved isometric, spun around)
  ];

  const t = sectionIndex + progressProgress;

  if (t >= 7.0) {
    return angles[7];
  }

  const floorIdx = Math.min(6, Math.max(0, Math.floor(t)));
  const ceilIdx = floorIdx + 1;
  const subProgress = t - floorIdx;

  const current = angles[floorIdx];
  const next = angles[ceilIdx];

  const x = current.x + (next.x - current.x) * subProgress;
  const y = current.y + (next.y - current.y) * subProgress;
  const z = current.z + (next.z - current.z) * subProgress;

  return { x, y, z };
}

/**
 * Legacy layer rotations calculation for other HUD/compatibility layers
 */
export function getLayerRotations(sectionIndex: number, sectionProgress: number): LayerAngles {
  const currentAngles = { 
    top: SCRAMBLE_TIMELINE.top,
    middleY: SCRAMBLE_TIMELINE.middleY,
    bottom: SCRAMBLE_TIMELINE.bottom,
    left: SCRAMBLE_TIMELINE.left,
    middleX: SCRAMBLE_TIMELINE.middleX,
    right: SCRAMBLE_TIMELINE.right,
    front: SCRAMBLE_TIMELINE.front,
    middleZ: SCRAMBLE_TIMELINE.middleZ,
    back: SCRAMBLE_TIMELINE.back,
  };

  const t = sectionIndex + sectionProgress;
  const p_capitals = Math.min(1.0, Math.max(0.0, (t - 1.0) / 6.0));

  if (p_capitals >= 1.0) {
    currentAngles.front = 0; currentAngles.right = 0; currentAngles.top = 0;
    currentAngles.left = 0; currentAngles.bottom = 0; currentAngles.back = 0;
  } else {
    // Top (solves in segment 3: p_capitals >= 2/6 to 3/6)
    if (p_capitals >= 3/6) currentAngles.top = 0;
    else if (p_capitals > 2/6) {
      const local = easeLayerSegment((p_capitals - 2/6) / (1/6));
      currentAngles.top = 90 * (1 - local);
    }

    // Bottom (solves in segment 5: p_capitals >= 4/6 to 5/6)
    if (p_capitals >= 5/6) currentAngles.bottom = 0;
    else if (p_capitals > 4/6) {
      const local = easeLayerSegment((p_capitals - 4/6) / (1/6));
      currentAngles.bottom = -90 * (1 - local);
    }

    // Left (solves in segment 4: p_capitals >= 3/6 to 4/6)
    if (p_capitals >= 4/6) currentAngles.left = 0;
    else if (p_capitals > 3/6) {
      const local = easeLayerSegment((p_capitals - 3/6) / (1/6));
      currentAngles.left = -90 * (1 - local);
    }

    // Right (solves in segment 2: p_capitals >= 1/6 to 2/6)
    if (p_capitals >= 2/6) currentAngles.right = 0;
    else if (p_capitals > 1/6) {
      const local = easeLayerSegment((p_capitals - 1/6) / (1/6));
      currentAngles.right = 90 * (1 - local);
    }

    // Front (solves in segment 1: p_capitals >= 0.0 to 1/6)
    if (p_capitals >= 1/6) currentAngles.front = 0;
    else if (p_capitals > 0) {
      const local = easeLayerSegment(p_capitals / (1 / 6));
      currentAngles.front = 90 * (1 - local);
    }

    // Back (solves in segment 6: p_capitals >= 5/6 to 1.0)
    if (p_capitals >= 1.0) currentAngles.back = 0;
    else if (p_capitals > 5/6) {
      const local = easeLayerSegment((p_capitals - 5/6) / (1/6));
      currentAngles.back = -90 * (1 - local);
    }
  }

  return currentAngles;
}

/**
 * Computes individual face angles under continuous scroll parameter t
 */
export function getSequentialFaceAngles(activeSectionIndex: number, scrollProgress: number) {
  const t = activeSectionIndex + scrollProgress;
  const p_capitals = Math.min(1.0, Math.max(0.0, (t - 1.0) / 6.0));

  // Face solve order: Back (theta1) -> Bottom (theta2) -> Left (theta3) -> Top (theta4) -> Right (theta5) -> Front (theta6)

  // 1. Front Turn (theta6): solves in segment 1 (p_capitals from 0.0 to 1/6)
  let theta6 = 90;
  if (p_capitals >= 1/6) {
    theta6 = 0;
  } else if (p_capitals > 0) {
    const local = easeLayerSegment(p_capitals / (1 / 6));
    theta6 = 90 * (1 - local);
  }

  // 2. Right Turn (theta5): solves in segment 2 (p_capitals from 1/6 to 2/6)
  let theta5 = 90;
  if (p_capitals >= 2/6) {
    theta5 = 0;
  } else if (p_capitals > 1/6) {
    const local = easeLayerSegment((p_capitals - 1/6) / (1/6));
    theta5 = 90 * (1 - local);
  }

  // 3. Top Turn (theta4): solves in segment 3 (p_capitals from 2/6 to 3/6)
  let theta4 = 90;
  if (p_capitals >= 3/6) {
    theta4 = 0;
  } else if (p_capitals > 2/6) {
    const local = easeLayerSegment((p_capitals - 2/6) / (1/6));
    theta4 = 90 * (1 - local);
  }

  // 4. Left Turn (theta3): solves in segment 4 (p_capitals from 3/6 to 4/6)
  let theta3 = -90;
  if (p_capitals >= 4/6) {
    theta3 = 0;
  } else if (p_capitals > 3/6) {
    const local = easeLayerSegment((p_capitals - 3/6) / (1/6));
    theta3 = -90 * (1 - local);
  }

  // 5. Bottom Turn (theta2): solves in segment 5 (p_capitals from 4/6 to 5/6)
  let theta2 = -90;
  if (p_capitals >= 5/6) {
    theta2 = 0;
  } else if (p_capitals > 4/6) {
    const local = easeLayerSegment((p_capitals - 4/6) / (1/6));
    theta2 = -90 * (1 - local);
  }

  // 6. Back Turn (theta1): solves in segment 6 (p_capitals from 5/6 to 1.0)
  let theta1 = -90;
  if (p_capitals >= 1.0) {
    theta1 = 0;
  } else if (p_capitals > 5/6) {
    const local = easeLayerSegment((p_capitals - 5/6) / (1/6));
    theta1 = -90 * (1 - local);
  }

  return { theta1, theta2, theta3, theta4, theta5, theta6 };
}

/**
 * Applies a 3D orthogonal rotation to a position vector and a 3D rotation matrix
 */
export function applyTurn(
  p: Vector3,
  R: Matrix3,
  axis: "X" | "Y" | "Z",
  condition: (pos: Vector3) => boolean,
  angleDeg: number
) {
  if (Math.abs(angleDeg) < 0.01) return { p, R };
  if (!condition(p)) return { p, R };

  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const nextP = { ...p };
  const nextR = [
    [...R[0]],
    [...R[1]],
    [...R[2]]
  ] as Matrix3;

  if (axis === "X") {
    // Rotate position about global X-axis
    nextP.y = p.y * cos - p.z * sin;
    nextP.z = p.y * sin + p.z * cos;

    // Rotate local rotation matrix: R_new = Rx * R
    for (let j = 0; j < 3; j++) {
      const r1 = R[1][j];
      const r2 = R[2][j];
      nextR[1][j] = r1 * cos - r2 * sin;
      nextR[2][j] = r1 * sin + r2 * cos;
    }
  } else if (axis === "Y") {
    // Rotate position about global Y-axis
    nextP.x = p.x * cos + p.z * sin;
    nextP.z = -p.x * sin + p.z * cos;

    // Rotate matrix: R_new = Ry * R
    for (let j = 0; j < 3; j++) {
      const r0 = R[0][j];
      const r2 = R[2][j];
      nextR[0][j] = r0 * cos + r2 * sin;
      nextR[2][j] = -r0 * sin + r2 * cos;
    }
  } else if (axis === "Z") {
    // Rotate position about global Z-axis
    nextP.x = p.x * cos - p.y * sin;
    nextP.y = p.x * sin + p.y * cos;

    // Rotate matrix: R_new = Rz * R
    for (let j = 0; j < 3; j++) {
      const r0 = R[0][j];
      const r1 = R[1][j];
      nextR[0][j] = r0 * cos - r1 * sin;
      nextR[1][j] = r0 * sin + r1 * cos;
    }
  }

  return { p: nextP, R: nextR };
}

/**
 * Advanced Kinematics Transform Matrix Generator for CSS 3D Cube layer solving.
 */
export function getCubieTransformMatrix(
  x0: number,
  y0: number,
  z0: number,
  activeSectionIndex: number,
  scrollProgress: number,
  cubieSize: number = 70,
  gap: number = 3
): string {
  const step = cubieSize + gap;

  // 1. Get current physical angles of sequential solves
  const { theta1, theta2, theta3, theta4, theta5, theta6 } = getSequentialFaceAngles(activeSectionIndex, scrollProgress);

  // 2. Initial solved state: identity matrix and original grid position
  let p: Vector3 = { x: x0, y: y0, z: z0 };
  let R: Matrix3 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ];

  // 3. Apply the 6 solving turn operators in logical sequence:
  // Turn 1: Back (z = -1)
  const res1 = applyTurn(p, R, "Z", (pos) => pos.z < -0.5, theta1);
  p = res1.p;
  R = res1.R;

  // Turn 2: Bottom (y = 1)
  const res2 = applyTurn(p, R, "Y", (pos) => pos.y > 0.5, theta2);
  p = res2.p;
  R = res2.R;

  // Turn 3: Left (x = -1)
  const res3 = applyTurn(p, R, "X", (pos) => pos.x < -0.5, theta3);
  p = res3.p;
  R = res3.R;

  // Turn 4: Top (y = -1)
  const res4 = applyTurn(p, R, "Y", (pos) => pos.y < -0.5, theta4);
  p = res4.p;
  R = res4.R;

  // Turn 5: Right (x = 1)
  const res5 = applyTurn(p, R, "X", (pos) => pos.x > 0.5, theta5);
  p = res5.p;
  R = res5.R;

  // Turn 6: Front (z = 1)
  const res6 = applyTurn(p, R, "Z", (pos) => pos.z > 0.5, theta6);
  p = res6.p;
  R = res6.R;

  // 4. Construct column-major matrix3d for standard browser CSS 3D transforms
  const a1 = R[0][0], a2 = R[1][0], a3 = R[2][0], a4 = 0;
  const b1 = R[0][1], b2 = R[1][1], b3 = R[2][1], b4 = 0;
  const c1 = R[0][2], c2 = R[1][2], c3 = R[2][2], c4 = 0;
  
  // Translation in pixels
  const d1 = p.x * step;
  const d2 = p.y * step;
  const d3 = p.z * step;
  const d4 = 1;

  return `matrix3d(
    ${a1.toFixed(7)}, ${a2.toFixed(7)}, ${a3.toFixed(7)}, ${a4},
    ${b1.toFixed(7)}, ${b2.toFixed(7)}, ${b3.toFixed(7)}, ${b4},
    ${c1.toFixed(7)}, ${c2.toFixed(7)}, ${c3.toFixed(7)}, ${c4},
    ${d1.toFixed(4)}, ${d2.toFixed(4)}, ${d3.toFixed(4)}, ${d4}
  )`;
}

/** Isometric fallback camera. */
export const CAPITAL_ISO_CAMERA = { x: -28, y: 38, z: 6 };

function matrix3dFromState(
  p: Vector3,
  R: Matrix3,
  step: number,
): string {
  const a1 = R[0][0], a2 = R[1][0], a3 = R[2][0], a4 = 0;
  const b1 = R[0][1], b2 = R[1][1], b3 = R[2][1], b4 = 0;
  const c1 = R[0][2], c2 = R[1][2], c3 = R[2][2], c4 = 0;
  const d1 = p.x * step;
  const d2 = p.y * step;
  const d3 = p.z * step;
  const d4 = 1;

  return `matrix3d(
    ${a1.toFixed(7)}, ${a2.toFixed(7)}, ${a3.toFixed(7)}, ${a4},
    ${b1.toFixed(7)}, ${b2.toFixed(7)}, ${b3.toFixed(7)}, ${b4},
    ${c1.toFixed(7)}, ${c2.toFixed(7)}, ${c3.toFixed(7)}, ${c4},
    ${d1.toFixed(4)}, ${d2.toFixed(4)}, ${d3.toFixed(4)}, ${d4}
  )`;
}

/** Fully solved cubie at grid position — no layer twists. */
export function getSolvedCubieTransformMatrix(
  x0: number,
  y0: number,
  z0: number,
  cubieSize: number = 70,
  gap: number = 3,
): string {
  const step = cubieSize + gap;
  const p: Vector3 = { x: x0, y: y0, z: z0 };
  const R: Matrix3 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  return matrix3dFromState(p, R, step);
}

/**
 * Cubie transform with developer-defined per-layer twists (in degrees).
 * Rows/cols/faces are applied sequentially, exactly like real cube turns, so a
 * cubie shared by several twisted slices composes the rotations in order.
 */
export function getTwistedCubieTransformMatrix(
  x0: number,
  y0: number,
  z0: number,
  twist: Partial<CubeLayerTwist>,
  cubieSize: number = 70,
  gap: number = 3,
): string {
  const step = cubieSize + gap;
  const t = { ...ZERO_CUBE_TWIST, ...twist };

  let p: Vector3 = { x: x0, y: y0, z: z0 };
  let R: Matrix3 = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  const turn = (
    axis: "X" | "Y" | "Z",
    condition: (pos: Vector3) => boolean,
    angle: number,
  ) => {
    const res = applyTurn(p, R, axis, condition, angle);
    p = res.p;
    R = res.R;
  };

  // Rows — horizontal slices spin around the Y axis.
  turn("Y", (pos) => pos.y < -0.5, t.rowTop);
  turn("Y", (pos) => Math.abs(pos.y) < 0.5, t.rowMiddle);
  turn("Y", (pos) => pos.y > 0.5, t.rowBottom);

  // Columns — vertical slices spin around the X axis.
  turn("X", (pos) => pos.x < -0.5, t.colLeft);
  turn("X", (pos) => Math.abs(pos.x) < 0.5, t.colMiddle);
  turn("X", (pos) => pos.x > 0.5, t.colRight);

  // Faces — depth slices spin around the Z axis.
  turn("Z", (pos) => pos.z > 0.5, t.faceFront);
  turn("Z", (pos) => Math.abs(pos.z) < 0.5, t.faceMiddle);
  turn("Z", (pos) => pos.z < -0.5, t.faceBack);

  return matrix3dFromState(p, R, step);
}

/** True when any layer of the twist is non-zero. */
export function hasActiveTwist(twist?: Partial<CubeLayerTwist> | null): boolean {
  if (!twist) return false;
  return Object.values(twist).some((v) => typeof v === "number" && Math.abs(v) > 0.01);
}

/** Per-capital face camera — Financial front, Manufactured right, Intellectual top, etc. */
export function getCapitalAssemblyRotation(
  capitalIndex: number,
  parallax: { x: number; y: number } = { x: 0, y: 0 },
): { x: number; y: number; z: number } {
  const clamped = Math.min(6, Math.max(1, capitalIndex));
  const base = getCubeAssemblyRotation(clamped, 0);
  return {
    x: base.x - parallax.y * 5,
    y: base.y + parallax.x * 8,
    z: base.z + parallax.x * 2,
  };
}

/**
 * Legacy support for old cubic rotation signature
 */
export function getCubieStyle(
  cx: number,
  cy: number,
  cz: number,
  layers: LayerAngles,
  cubieSize: number = 72,
  gap: number = 3
): string {
  // Directly fall back to solved coordinates
  const step = cubieSize + gap;
  const baseX = cx * step;
  const baseY = cy * step;
  const baseZ = cz * step;
  return `translate3d(${baseX}px, ${baseY}px, ${baseZ}px)`;
}
