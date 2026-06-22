import { CAPITALS_DATA } from "./capitalsData";

/** Y-position where each capital chapter label locks the carousel (px from viewport top). */
export const SERIES_ANCHOR_Y = 112; // NAVBAR_OFFSET (80) + 32

export function getSeriesMarkerTops(): number[] | null {
  const tops = CAPITALS_DATA.map((c) => {
    const el = document.getElementById(`${c.id}-series-marker`);
    return el ? el.getBoundingClientRect().top : null;
  });
  return tops.some((t) => t === null) ? null : (tops as number[]);
}

/**
 * Continuous carousel index 0–5 from marker Y vs SERIES_ANCHOR_Y.
 * Fully linear between markers — no snap — so scroll scrub matches 1:1.
 */
export function computeCarouselPositionFromMarkers(tops: number[]): number {
  const anchor = SERIES_ANCHOR_Y;
  const last = tops.length - 1;

  if (tops[0] > anchor) return 0;
  if (tops[last] <= anchor) return last;

  for (let i = 0; i < last; i++) {
    const curr = tops[i];
    const next = tops[i + 1];
    if (curr <= anchor && next > anchor) {
      const span = next - curr;
      if (span <= 1) return i;
      const t = 1 - (next - anchor) / span;
      return i + Math.max(0, Math.min(1, t));
    }
  }

  for (let i = last; i >= 0; i--) {
    if (tops[i] <= anchor) return i;
  }
  return 0;
}

/** Past the last capital — hold Natural while still inside the capitals chapter. */
export function isPastLastCapital(tops: number[]): boolean {
  const anchor = SERIES_ANCHOR_Y;
  const lastMarker = tops[tops.length - 1];
  const endEl = document.getElementById("natural");
  if (!endEl) return false;
  const sectionBottom = endEl.getBoundingClientRect().bottom;
  return lastMarker < anchor - 40 && sectionBottom < anchor;
}

/** Read live carousel position from DOM (0–5). Returns null outside capitals chapter. */
export function readLiveCarouselPosition(): number | null {
  const wrapper = document.getElementById("universal-capitals-wrapper");
  if (!wrapper) return null;

  const rect = wrapper.getBoundingClientRect();
  if (rect.bottom < 0 || rect.top > window.innerHeight) return null;

  const tops = getSeriesMarkerTops();
  if (!tops) return null;

  if (isPastLastCapital(tops)) {
    return CAPITALS_DATA.length - 1;
  }

  return computeCarouselPositionFromMarkers(tops);
}

export function carouselPositionToSection(position: number): {
  index: number;
  progress: number;
} {
  const clamped = Math.max(0, Math.min(CAPITALS_DATA.length - 1, position));
  const index = Math.floor(clamped) + 1;
  const progress = clamped - Math.floor(clamped);
  return { index, progress };
}

export function scrollToCapitalMarker(index: number): void {
  const capital = CAPITALS_DATA[index];
  if (!capital) return;

  const marker = document.getElementById(`${capital.id}-series-marker`);
  const section = document.getElementById(capital.id);

  if (!marker) {
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const markerTop = marker.getBoundingClientRect().top;
  const targetY = window.scrollY + markerTop - SERIES_ANCHOR_Y;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clampedTarget = Math.min(Math.max(0, targetY), maxScroll);

  window.scrollTo({ top: clampedTarget, behavior: "smooth" });
}
