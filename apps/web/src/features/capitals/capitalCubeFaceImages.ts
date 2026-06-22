/**
 * One source image per Rubik-cube face (6 capitals).
 * Each face is torn into a 3×3 grid in CSS — no per-cell image files.
 *
 * Paths point at the original Capital pages folder (sibling of this repo):
 *   ../Capital pages/
 *
 * Vite resolves these via the `@capital-pages` alias (see vite.config.ts).
 * Run `scripts/build-capital-cube-faces.sh` only if you need pre-built montage
 * webps for deploy; sources are never copied into this repositoryhhy.
 */

export type CubeFaceName =
  | "front"
  | "back"
  | "left"
  | "right"
  | "top"
  | "bottom";

export interface CubeFaceImageConfig {
  /** Vite-resolved URL to the single face texture */
  src: string;
  label: string;
}

/** Rubik face → capital (Financial front, Manufactured right, …). */
export const CUBE_FACE_ORDER: CubeFaceName[] = [
  "front",
  "right",
  "top",
  "left",
  "bottom",
  "back",
];

/**
 * Relative paths inside `Capital pages/` — one hero image per visible side.
 * Swap any path here; the cube splits it into nine stickers automatically.
 */
export const CAPITAL_PAGE_FACE_PATHS: Record<CubeFaceName, string> = {
  front: "Financial Capital/DSC_0854 copy.jpg",
  right: "Manufactured Capital/DJI_0398.jpg",
  top: "Intellectual capital/Copy of 7R501750.jpg",
  left: "Human Capital/C P 16.jpg",
  bottom: "Social and Relationship/7R503738-Edit.jpg",
  back: "Natural Capital/forest.jpg",
};

export const CAPITAL_PAGE_FACE_LABELS: Record<CubeFaceName, string> = {
  front: "Financial capital",
  right: "Manufactured capital",
  top: "Intellectual capital",
  left: "Human capital",
  bottom: "Social capital",
  back: "Natural capital",
};

/** Eager imports — Vite bundles/serves from @capital-pages alias (not committed). */
import faceFront from "@capital-pages/Financial Capital/DSC_0854 copy.jpg?url";
import faceRight from "@capital-pages/Manufactured Capital/DJI_0398.jpg?url";
import faceTop from "@capital-pages/Intellectual capital/Copy of 7R501750.jpg?url";
import faceLeft from "@capital-pages/Human Capital/C P 16.jpg?url";
import faceBottom from "@capital-pages/Social and Relationship/7R503738-Edit.jpg?url";
import faceBack from "@capital-pages/Natural Capital/forest.jpg?url";

export const CUBE_FACE_IMAGES: Record<CubeFaceName, CubeFaceImageConfig> = {
  front: { src: faceFront, label: CAPITAL_PAGE_FACE_LABELS.front },
  right: { src: faceRight, label: CAPITAL_PAGE_FACE_LABELS.right },
  top: { src: faceTop, label: CAPITAL_PAGE_FACE_LABELS.top },
  left: { src: faceLeft, label: CAPITAL_PAGE_FACE_LABELS.left },
  bottom: { src: faceBottom, label: CAPITAL_PAGE_FACE_LABELS.bottom },
  back: { src: faceBack, label: CAPITAL_PAGE_FACE_LABELS.back },
};
