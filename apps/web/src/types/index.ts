export interface SDG {
  number: number;
  name: string;
  color: string;
  icon: string;
}

export interface CapitalData {
  id: string;
  index: number;
  title: string;
  concept: string;
  body: string[];
  sdgs: SDG[];
  themeColor: string; // Tailwind class color
  accentColor: string; // Gold or complementary
  cubeFaceIndex: number; // 0-5 mapping to R, L, U, D, F, B
}

export interface CubeAnimationState {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scrambleAmount: number; // 1 = fully scrambled, 0 = solved
  activeFaceOffset: Record<string, number>; // Rotation of layers e.g. { U: 0, L: 90 ... }
}
