/** Blocks marker-based scroll spy while programmatic carousel navigation is in flight. */
let lockedUntil = 0;

export function lockCarouselScrollSync(durationMs = 1400) {
  lockedUntil = Date.now() + durationMs;
}

export function isCarouselScrollSyncLocked(): boolean {
  return Date.now() < lockedUntil;
}

export function unlockCarouselScrollSync() {
  lockedUntil = 0;
}
