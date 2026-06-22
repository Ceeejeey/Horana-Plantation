import { useEffect } from "react";
import { useActiveSection } from "../context/ActiveSectionContext";
import { CAPITALS_DATA } from "../features/capitals/capitalsData";
import { isCarouselScrollSyncLocked } from "../features/capitals/carouselSyncLock";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NAVBAR_OFFSET = 80;
const DESKTOP_MQ = "(min-width: 1024px)";
/** Y-position where each "0X / 06 Capital Series" label locks the carousel */
export const SERIES_ANCHOR_Y = NAVBAR_OFFSET + 32;
/** Snap to exact capital when its series label is within this many px of the anchor */
const MARKER_SNAP_PX = 20;

function mapProgressToCapitals(
  p: number,
  setActiveSection: (index: number, progress: number) => void,
) {
  const clamped = Math.min(1, Math.max(0, p));
  const rawIdx = clamped * 6;
  const capitalIdx = Math.min(5, Math.floor(rawIdx));
  setActiveSection(capitalIdx + 1, rawIdx - capitalIdx);
}

function getSeriesMarkerTops(): number[] | null {
  const tops = CAPITALS_DATA.map((c) => {
    const el = document.getElementById(`${c.id}-series-marker`);
    return el ? el.getBoundingClientRect().top : null;
  });
  return tops.some((t) => t === null) ? null : (tops as number[]);
}

/**
 * Carousel index 0–5 from live marker Y positions vs SERIES_ANCHOR_Y.
 * Snaps to integer when a label is on the anchor line.
 */
export function computeCarouselPositionFromMarkers(tops: number[]): number {
  const anchor = SERIES_ANCHOR_Y;
  const last = tops.length - 1;

  for (let i = 0; i < tops.length; i++) {
    if (Math.abs(tops[i] - anchor) < MARKER_SNAP_PX) {
      return i;
    }
  }

  if (tops[0] > anchor) return 0;
  if (tops[last] <= anchor) return last;

  // Marker i has scrolled past the anchor; marker i+1 is still below it.
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

function applyCarouselPosition(
  position: number,
  setActiveSection: (index: number, progress: number) => void,
) {
  const clamped = Math.max(0, Math.min(CAPITALS_DATA.length - 1, position));
  setActiveSection(Math.floor(clamped) + 1, clamped - Math.floor(clamped));
}

function resetCubeCanvasStyles(reason = "reset") {
  const el = document.getElementById("cube-canvas-container");
  if (!el) return;
  gsap.killTweensOf(el);
  el.removeAttribute("aria-hidden");
  gsap.set(el, { clearProps: "all" });

  // #region agent log
  fetch("http://127.0.0.1:7807/ingest/7dd37490-65c0-4437-a25c-304992d14e64", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "dfb150" },
    body: JSON.stringify({
      sessionId: "dfb150",
      runId: "cube-scroll",
      hypothesisId: "H-sticky",
      location: "useScrollSpy.ts:resetCubeCanvasStyles",
      message: "cube styles reset",
      data: {
        reason,
        cubeTop: Math.round(el.getBoundingClientRect().top),
        naturalBottom: document.getElementById("natural")?.getBoundingClientRect().bottom ?? null,
        scrollY: Math.round(window.scrollY),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

function applyCubeExitLift(): number {
  const inner = document.getElementById("cube-scroll-inner");
  const container = document.getElementById("cube-canvas-container");
  const natural = document.getElementById("natural");
  if (!inner || !natural) return 0;

  const naturalBottom = natural.getBoundingClientRect().bottom;
  const viewHeight = window.innerHeight;

  // Scroll-locked exit: the cube stays centred while reading Natural, then once
  // the section's bottom edge nears the bottom of the viewport it rides upward
  // 1:1 with scroll — i.e. at exactly the page scroll speed — and is fully gone
  // by the time the pin releases (naturalBottom === NAVBAR_OFFSET).
  const exitStart = viewHeight * 0.92;
  const travelMax = Math.max(1, exitStart - NAVBAR_OFFSET);

  // distance grows by exactly 1px per 1px of scroll, so motion matches scroll.
  const distance = Math.max(0, Math.min(travelMax, exitStart - naturalBottom));
  const t = distance / travelMax;

  const y = -distance;
  // Keep the cube fully opaque through most of the exit; fade only the last leg.
  const fade = t > 0.8 ? Math.max(0, 1 - (t - 0.8) / 0.2) : 1;

  gsap.set(inner, { y, autoAlpha: fade, force3D: true, overwrite: "auto" });

  if (container) {
    if (t >= 0.999) {
      gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
    } else {
      gsap.set(container, { autoAlpha: 1, pointerEvents: "auto" });
    }
  }

  return t;
}

function showChapterCube(reason: string) {
  const container = document.getElementById("cube-canvas-container");
  const inner = document.getElementById("cube-scroll-inner");
  if (inner) gsap.set(inner, { clearProps: "y,transform,opacity" });
  if (container) {
    container.removeAttribute("aria-hidden");
    gsap.set(container, { autoAlpha: 1, visibility: "visible", pointerEvents: "auto" });
  }
  logCubeScrollPhase(reason);
}

function hideChapterCube(reason: string) {
  const container = document.getElementById("cube-canvas-container");
  if (container) {
    container.setAttribute("aria-hidden", "true");
    gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
  }
  logCubeScrollPhase(reason);
}

function logCubeScrollPhase(reason: string) {
  const el = document.getElementById("cube-canvas-container");
  const inner = document.getElementById("cube-scroll-inner");
  const natural = document.getElementById("natural");
  const leadership = document.getElementById("leadership");
  // #region agent log
  fetch("http://127.0.0.1:7807/ingest/7dd37490-65c0-4437-a25c-304992d14e64", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "dfb150" },
    body: JSON.stringify({
      sessionId: "dfb150",
      runId: "cube-scroll",
      hypothesisId: "H-natural-exit",
      location: "useScrollSpy.ts:logCubeScrollPhase",
      message: reason,
      data: {
        cubeTop: el ? Math.round(el.getBoundingClientRect().top) : null,
        innerY: inner ? Math.round(gsap.getProperty(inner, "y") as number) : null,
        cubeOpacity: el ? getComputedStyle(el).opacity : null,
        cubeVisibility: el ? getComputedStyle(el).visibility : null,
        naturalBottom: natural ? Math.round(natural.getBoundingClientRect().bottom) : null,
        leadershipTop: leadership ? Math.round(leadership.getBoundingClientRect().top) : null,
        scrollY: Math.round(window.scrollY),
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
}

/** Past the last capital — hold Natural state while still inside the capitals chapter. */
function isPastLastCapital(tops: number[]): boolean {
  const anchor = SERIES_ANCHOR_Y;
  const lastMarker = tops[tops.length - 1];
  const endEl = document.getElementById("natural");
  if (!endEl) return false;
  const sectionBottom = endEl.getBoundingClientRect().bottom;
  return lastMarker < anchor - 40 && sectionBottom < anchor;
}

function setupChapterCapitalsScroll(setActiveSection: (index: number, progress: number) => void) {
  const cleanups: (() => void)[] = [];

  const syncFromMarkers = () => {
    if (isCarouselScrollSyncLocked()) return;
    const tops = getSeriesMarkerTops();
    if (!tops) return;

    if (isPastLastCapital(tops)) {
      setActiveSection(CAPITALS_DATA.length, 0);
      return;
    }

    const position = computeCarouselPositionFromMarkers(tops);
    applyCarouselPosition(position, setActiveSection);

    // #region agent log
    fetch("http://127.0.0.1:7807/ingest/7dd37490-65c0-4437-a25c-304992d14e64", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "dfb150" },
      body: JSON.stringify({
        sessionId: "dfb150",
        runId: "carousel-nav",
        hypothesisId: "H4-sync",
        location: "useScrollSpy.ts:syncFromMarkers",
        message: "marker sync",
        data: {
          tops: tops.map((t) => Math.round(t)),
          position,
          sectionIndex: Math.floor(position) + 1,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  };

  const introHold = ScrollTrigger.create({
    trigger: "#six-capitals-intro",
    start: "top bottom",
    end: "bottom top",
    onEnter: () => setActiveSection(1, 0),
    onEnterBack: () => setActiveSection(1, 0),
    invalidateOnRefresh: true,
  });
  cleanups.push(() => introHold.kill());

  if (window.matchMedia(DESKTOP_MQ).matches) {
    resetCubeCanvasStyles("chapter-init");

    let lastLiftLog = -1;

    const pinTrigger = ScrollTrigger.create({
      trigger: "#six-capitals-intro",
      start: `top ${NAVBAR_OFFSET}px`,
      endTrigger: "#natural",
      end: `bottom ${NAVBAR_OFFSET}px`,
      pin: "#cube-canvas-container",
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: () => {
        const lift = applyCubeExitLift();
        if (lift > 0.04 && Math.abs(lift - lastLiftLog) > 0.07) {
          lastLiftLog = lift;
          const inner = document.getElementById("cube-scroll-inner");
          const leadership = document.getElementById("leadership");
          logCubeScrollPhase(`pin lift t=${lift.toFixed(2)}`);
          // #region agent log
          fetch("http://127.0.0.1:7807/ingest/7dd37490-65c0-4437-a25c-304992d14e64", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "dfb150" },
            body: JSON.stringify({
              sessionId: "dfb150",
              runId: "cube-scroll",
              hypothesisId: "H-lift-inner",
              location: "useScrollSpy.ts:pinTrigger.onUpdate",
              message: "exit lift applied",
              data: {
                lift: Math.round(lift * 1000) / 1000,
                innerY: inner ? Math.round(gsap.getProperty(inner, "y") as number) : null,
                innerOpacity: inner ? getComputedStyle(inner).opacity : null,
                naturalBottom: Math.round(
                  document.getElementById("natural")?.getBoundingClientRect().bottom ?? 0,
                ),
                leadershipTop: leadership
                  ? Math.round(leadership.getBoundingClientRect().top)
                  : null,
                scrollY: Math.round(window.scrollY),
              },
              timestamp: Date.now(),
            }),
          }).catch(() => {});
          // #endregion
        }
      },
      onEnterBack: () => {
        lastLiftLog = -1;
        showChapterCube("pin onEnterBack shown");
        requestAnimationFrame(() => ScrollTrigger.refresh());
      },
      onLeave: (self) => {
        lastLiftLog = -1;
        if (self.direction === 1) {
          hideChapterCube("pin onLeave hidden (past natural)");
        }
      },
      onLeaveBack: () => {
        lastLiftLog = -1;
        hideChapterCube("pin onLeaveBack hidden (above capitals)");
      },
    });
    cleanups.push(() => pinTrigger.kill());

    const leadershipGuard = ScrollTrigger.create({
      trigger: "#leadership",
      start: "top 90%",
      onEnter: () => hideChapterCube("leadership entered"),
      onLeaveBack: () => {
        const six = document.getElementById("six-capitals");
        if (!six) return;
        const rect = six.getBoundingClientRect();
        if (rect.bottom > NAVBAR_OFFSET && rect.top < window.innerHeight) {
          showChapterCube("leadership onLeaveBack show");
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      },
      invalidateOnRefresh: true,
    });
    cleanups.push(() => leadershipGuard.kill());
  }

  const markerSync = ScrollTrigger.create({
    trigger: "#universal-capitals-wrapper",
    start: "top bottom",
    endTrigger: "#natural",
    end: "bottom top",
    onUpdate: syncFromMarkers,
    invalidateOnRefresh: true,
  });
  cleanups.push(() => markerSync.kill());

  syncFromMarkers();

  return cleanups;
}

function setupLegacyCapitalsScroll(setActiveSection: (index: number, progress: number) => void) {
  const cleanups: (() => void)[] = [];

  const scrollObj = { progress: 0 };
  const mainTween = gsap.to(scrollObj, {
    progress: 1,
    ease: "none",
    onUpdate: () => mapProgressToCapitals(scrollObj.progress, setActiveSection),
    scrollTrigger: {
      trigger: "#six-capitals",
      start: "top top",
      endTrigger: "#capitals-pin-wrapper",
      end: "bottom bottom",
      scrub: 1.35,
      invalidateOnRefresh: true,
    },
  });
  cleanups.push(() => {
    mainTween.scrollTrigger?.kill();
    mainTween.kill();
  });

  return cleanups;
}

export function useScrollSpy(active: boolean = true) {
  const { setActiveSection } = useActiveSection();

  useEffect(() => {
    if (!active) return;

    const isChapter = Boolean(document.getElementById("six-capitals-intro"));
    const cleanups = isChapter
      ? setupChapterCapitalsScroll(setActiveSection)
      : setupLegacyCapitalsScroll(setActiveSection);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 250);
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      cleanups.forEach((fn) => fn());
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [setActiveSection, active]);
}
