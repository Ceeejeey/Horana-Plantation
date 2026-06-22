/**
 * Rubik-cube face textures for loading screen & hero cube (RubikCube3D).
 * Each face is a 1200×1200 image split into a 3×3 CSS grid (see RubikCube3D).
 *
 * Source: `apps/web/src/assets/load_cube/capital1.png` … `capital6.png`
 */

import capital1 from "@/assets/load_cube/capital1.png";
import capital2 from "@/assets/load_cube/capital2.png";
import capital3 from "@/assets/load_cube/capital3.png";
import capital4 from "@/assets/load_cube/capital4.png";
import capital5 from "@/assets/load_cube/capital5.png";
import capital6 from "@/assets/load_cube/capital6.png";

export type CubeFaceName =
  | "front"
  | "back"
  | "left"
  | "right"
  | "top"
  | "bottom";

export interface CubeFaceImageConfig {
  src: string;
  label: string;
}

export const CUBE_FACE_ORDER: CubeFaceName[] = [
  "front",
  "right",
  "top",
  "left",
  "bottom",
  "back",
];

export const CAPITAL_PAGE_FACE_LABELS: Record<CubeFaceName, string> = {
  front: "Financial capital",
  right: "Manufactured capital",
  top: "Intellectual capital",
  left: "Human capital",
  bottom: "Social capital",
  back: "Natural capital",
};

export const CUBE_FACE_IMAGES: Record<CubeFaceName, CubeFaceImageConfig> = {
  front: {
    src: capital1,
    label: CAPITAL_PAGE_FACE_LABELS.front,
  },
  right: {
    src: capital2,
    label: CAPITAL_PAGE_FACE_LABELS.right,
  },
  top: {
    src: capital3,
    label: CAPITAL_PAGE_FACE_LABELS.top,
  },
  left: {
    src: capital4,
    label: CAPITAL_PAGE_FACE_LABELS.left,
  },
  bottom: {
    src: capital5,
    label: CAPITAL_PAGE_FACE_LABELS.bottom,
  },
  back: {
    src: capital6,
    label: CAPITAL_PAGE_FACE_LABELS.back,
  },
};
