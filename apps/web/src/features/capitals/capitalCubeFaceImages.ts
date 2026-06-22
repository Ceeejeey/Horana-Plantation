/**
 * Rubik-cube face textures — optimized WebP on Firebase Storage.
 * Each face is split into a 3×3 CSS grid (see RubikCube3D).
 *
 * Regenerate uploads: npm run storage:optimize-cube-faces
 */

import { STORAGE_ASSETS } from "@/config/storageAssets";

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
    src: STORAGE_ASSETS.cubeFaces.front,
    label: CAPITAL_PAGE_FACE_LABELS.front,
  },
  right: {
    src: STORAGE_ASSETS.cubeFaces.right,
    label: CAPITAL_PAGE_FACE_LABELS.right,
  },
  top: {
    src: STORAGE_ASSETS.cubeFaces.top,
    label: CAPITAL_PAGE_FACE_LABELS.top,
  },
  left: {
    src: STORAGE_ASSETS.cubeFaces.left,
    label: CAPITAL_PAGE_FACE_LABELS.left,
  },
  bottom: {
    src: STORAGE_ASSETS.cubeFaces.bottom,
    label: CAPITAL_PAGE_FACE_LABELS.bottom,
  },
  back: {
    src: STORAGE_ASSETS.cubeFaces.back,
    label: CAPITAL_PAGE_FACE_LABELS.back,
  },
};
