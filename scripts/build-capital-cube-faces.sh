#!/usr/bin/env bash
# Optional: build 3×3 montage webps from Capital pages (legacy loading-screen assets).
# The app now loads one image per cube face directly from ../Capital pages via Vite
# (see apps/web/src/features/capitals/capitalCubeFaceImages.ts).
#
# This script no longer copies sources into the repo.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CAPITAL_PAGES="${CAPITAL_PAGES:-$(cd "$ROOT/../Capital pages" 2>/dev/null && pwd || echo "/home/gihan/Documents/horana_plantation/Capital pages")}"
OUT="$ROOT/apps/web/src/assets/loading-animation-image"
THUMB_OUT="$OUT/thumb"

FULL_W=6240
FULL_H=4160
CELL_W=$((FULL_W / 3))
CELL_H=$((FULL_H / 3))
THUMB_W=2080
THUMB_H=1387
THUMB_CELL_W=$((THUMB_W / 3))
THUMB_CELL_H=$((THUMB_H / 3))

mkdir -p "$THUMB_OUT"

prepare_photo_cell() {
  local src="$1"
  local dest="$2"
  local w="$3"
  local h="$4"
  convert "$src" -auto-orient -thumbnail "${w}x${h}^" -gravity center -extent "${w}x${h}" "$dest"
}

prepare_sdg_cell() {
  local src="$1"
  local dest="$2"
  local w="$3"
  local h="$4"
  convert "$src" -background "#f4f4f4" -gravity center -resize "$((w * 72 / 100))x$((h * 72 / 100))" -extent "${w}x${h}" "$dest"
}

build_face_from_cells() {
  local name="$1"
  local face_num="$2"
  shift 2
  local -a cells=("$@")
  local workdir
  workdir=$(mktemp -d)

  if [[ "${#cells[@]}" -ne 9 ]]; then
    echo "Expected 9 cells for ${name}, got ${#cells[@]}" >&2
    exit 1
  fi

  local i=0
  for cell in "${cells[@]}"; do
    i=$((i + 1))
    if [[ "$cell" == sdg:* ]]; then
      prepare_sdg_cell "${cell#sdg:}" "$workdir/cell_${i}.jpg" "$CELL_W" "$CELL_H"
    else
      prepare_photo_cell "$cell" "$workdir/cell_${i}.jpg" "$CELL_W" "$CELL_H"
    fi
  done

  montage "$workdir"/cell_*.jpg -tile 3x3 -geometry +0+0 "$workdir/full.jpg"
  convert "$workdir/full.jpg" -quality 82 "$OUT/${face_num}.webp"

  i=0
  for cell in "${cells[@]}"; do
    i=$((i + 1))
    if [[ "$cell" == sdg:* ]]; then
      prepare_sdg_cell "${cell#sdg:}" "$workdir/thumb_${i}.jpg" "$THUMB_CELL_W" "$THUMB_CELL_H"
    else
      prepare_photo_cell "$cell" "$workdir/thumb_${i}.jpg" "$THUMB_CELL_W" "$THUMB_CELL_H"
    fi
  done

  montage "$workdir"/thumb_*.jpg -tile 3x3 -geometry +0+0 "$workdir/thumb.jpg"
  convert "$workdir/thumb.jpg" -quality 78 "$THUMB_OUT/${face_num}.webp"

  rm -rf "$workdir"
  echo "Built face ${face_num} (${name})"
}

MFG_DIR="$CAPITAL_PAGES/Manufactured Capital"
FIN_DIR="$CAPITAL_PAGES/Financial Capital"

FIN_CELLS=(
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_1.png"
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_8.png"
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_1.png"
  "$FIN_DIR/DSC_0854 copy.jpg"
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_8.png"
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_1.png"
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_8.png"
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_1.png"
  "sdg:$FIN_DIR/TheGlobalGoals_Icons_Color_Goal_8.png"
)
build_face_from_cells financial 1 "${FIN_CELLS[@]}"

MFG_CELLS=(
  "sdg:$MFG_DIR/TheGlobalGoals_Icons_Color_Goal_13.png"
  "$MFG_DIR/DJI_0398.jpg"
  "sdg:$MFG_DIR/TheGlobalGoals_Icons_Color_Goal_15.png"
  "sdg:$MFG_DIR/TheGlobalGoals_Icons_Color_Goal_6.png"
  "$MFG_DIR/DJI_0855.jpg"
  "$MFG_DIR/7R505144.jpg"
  "sdg:$MFG_DIR/TheGlobalGoals_Icons_Color_Goal_17.png"
  "$MFG_DIR/7R501609.jpg"
  "sdg:$MFG_DIR/TheGlobalGoals_Icons_Color_Goal_7.png"
)
build_face_from_cells manufactured 2 "${MFG_CELLS[@]}"

INT=(
  "$CAPITAL_PAGES/Intellectual capital/Copy of 7R501750.jpg"
  "$CAPITAL_PAGES/Intellectual capital/Copy of 3.jpg"
  "$CAPITAL_PAGES/Intellectual capital/7R504206.jpg"
  "$CAPITAL_PAGES/Intellectual capital/Copy of 6.jpg"
  "$CAPITAL_PAGES/Intellectual capital/Copy of 1.jpg"
  "$CAPITAL_PAGES/Intellectual capital/Copy of 7R501452.jpg"
  "$CAPITAL_PAGES/Intellectual capital/New/20250711_132718.jpg"
  "$CAPITAL_PAGES/Intellectual capital/New/Copy of 7R505097.jpg"
  "$CAPITAL_PAGES/Intellectual capital/New/Copy of 7R504732.jpg"
)
build_face_from_cells intellectual 3 "${INT[@]}"

HUM=(
  "$CAPITAL_PAGES/Human Capital/C P 16.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 12.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 11.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 4.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 1.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 15.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 18.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 7.jpg"
  "$CAPITAL_PAGES/Human Capital/C P 13.jpg"
)
build_face_from_cells human 4 "${HUM[@]}"

SOC=(
  "$CAPITAL_PAGES/Social and Relationship/7R503738-Edit.jpg"
  "$CAPITAL_PAGES/Social and Relationship/7R505247-Edit-Edit.jpg"
  "$CAPITAL_PAGES/Social and Relationship/7R505033.jpg"
  "$CAPITAL_PAGES/Social and Relationship/Copy of 11.jpg"
  "$CAPITAL_PAGES/Social and Relationship/Copy of 4.jpg"
  "$CAPITAL_PAGES/Social and Relationship/New/IMG_1793.JPG"
  "$CAPITAL_PAGES/Social and Relationship/New/IMG_7329 (1).JPG"
  "$CAPITAL_PAGES/Social and Relationship/New/IMG_7381.JPG"
  "$CAPITAL_PAGES/Social and Relationship/Copy of 6.jpg"
)
build_face_from_cells social 5 "${SOC[@]}"

NAT=(
  "$CAPITAL_PAGES/Natural Capital/forest.jpg"
  "$CAPITAL_PAGES/Natural Capital/DJI_0639.jpg"
  "$CAPITAL_PAGES/Natural Capital/Scarlet Minivet .jpg"
  "$CAPITAL_PAGES/Natural Capital/New/2.jpg"
  "$CAPITAL_PAGES/Natural Capital/New/7R502477.jpg"
  "$CAPITAL_PAGES/Natural Capital/New/1.JPG"
  "$CAPITAL_PAGES/Natural Capital/New/IMG_8352.jpg"
  "$CAPITAL_PAGES/Natural Capital/Copy of 2.jpg"
  "$CAPITAL_PAGES/Natural Capital/Osbeckia rubicunda (2).jpg"
)
build_face_from_cells natural 6 "${NAT[@]}"

echo "Done. Note: RubikCube3D uses @capital-pages imports; webps are optional legacy output."
