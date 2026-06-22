import { useEffect } from "react";
import { useActiveSection } from "../context/ActiveSectionContext";
import { CAPITALS_DATA } from "../features/capitals/capitalsData";
import { isCarouselScrollSyncLocked } from "../features/capitals/carouselSyncLock";
import {
  SERIES_ANCHOR_Y,
  carouselPositionToSection,
  computeCarouselPositionFromMarkers,
  getSeriesMarkerTops,
  isPastLastCapital,
  readLiveCarouselPosition,
} from "../features/capitals/carouselScrollSync";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { SERIES_ANCHOR_Y, computeCarouselPositionFromMarkers } from "../features/capitals/carouselScrollSync";

const NAVBAR_OFFSET = 80;
const DESKTOP_MQ = "(min-width: 1024px)";
const SECTION_EPSILON = 0.0005;

function mapProgressToCapitals(
  p: number,
  setActiveSection: (index: number, progress: number) => void,
) {
  const clamped = Math.min(1, Math.max(0, p));
  const rawIdx = clamped * 6;
  const capitalIdx = Math.min(5, Math.floor(rawIdx));
  setActiveSection(capitalIdx + 1, rawIdx - capitalIdx);
}

function resetCubeCanvasStyles() {
  const el = document.getElementById("cube-canvas-container");
  if (!el) return;
  gsap.killTweensOf(el);
  el.removeAttribute("aria-hidden");
  gsap.set(el, { clearProps: "all" });
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/** Entrance (slide up with #six-capitals) + exit (lift away after last capital). */
function applyCubeScrollMotion(): void {
  const section = document.getElementById("six-capitals");
  const inner = document.getElementById("cube-scroll-inner");
  const container = document.getElementById("cube-canvas-container");
  const natural = document.getElementById("natural");
  if (!section || !inner) return;

  const vh = window.innerHeight;
  const sectionRect = section.getBoundingClientRect();

  if (sectionRect.bottom < NAVBAR_OFFSET || sectionRect.top > vh * 1.05) {
    gsap.set(inner, { y: 108, autoAlpha: 0, scale: 0.86, force3D: true });
    if (container) {
      container.setAttribute("aria-hidden", "true");
      gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
    }
    return;
  }

  const enterStart = vh * 0.97;
  const enterEnd = vh * 0.32;
  const enterT = smoothstep((enterStart - sectionRect.top) / (enterStart - enterEnd));

  let y = (1 - enterT) * 104;
  let opacity = 0.08 + enterT * 0.92;
  let scale = 0.86 + enterT * 0.14;

  if (natural) {
    const naturalBottom = natural.getBoundingClientRect().bottom;
    const exitStart = vh * 0.88;
    const travelMax = Math.max(1, exitStart - NAVBAR_OFFSET);
    const distance = Math.max(0, Math.min(travelMax, exitStart - naturalBottom));
    const exitT = smoothstep(distance / travelMax);

    if (exitT > 0) {
      y = -distance * (0.85 + exitT * 0.15);
      opacity *= 1 - exitT;
      scale *= 1 - exitT * 0.12;
    }
  }

  gsap.set(inner, {
    y,
    autoAlpha: Math.max(0, opacity),
    scale,
    force3D: true,
    transformOrigin: "center center",
    overwrite: "auto",
  });

  if (container) {
    const visible = enterT > 0.06 && opacity > 0.05;
    if (visible) {
      container.removeAttribute("aria-hidden");
    } else {
      container.setAttribute("aria-hidden", "true");
    }
    gsap.set(container, {
      autoAlpha: visible ? 1 : 0,
      pointerEvents: enterT > 0.38 && opacity > 0.18 ? "auto" : "none",
    });
  }
}

function showChapterCube() {
  const container = document.getElementById("cube-canvas-container");
  if (container) {
    container.removeAttribute("aria-hidden");
    gsap.set(container, { autoAlpha: 1, visibility: "visible" });
  }
  applyCubeScrollMotion();
}

function hideChapterCube() {
  const container = document.getElementById("cube-canvas-container");
  const inner = document.getElementById("cube-scroll-inner");
  if (inner) {
    gsap.set(inner, { y: 108, autoAlpha: 0, scale: 0.86, force3D: true });
  }
  if (container) {
    container.setAttribute("aria-hidden", "true");
    gsap.set(container, { autoAlpha: 0, pointerEvents: "none" });
  }
}

function setupChapterCapitalsScroll(setActiveSection: (index: number, progress: number) => void) {
  const cleanups: (() => void)[] = [];
  let lastIndex = -1;
  let lastProgress = -1;

  const syncFromMarkers = () => {
    if (isCarouselScrollSyncLocked()) return;

    const live = readLiveCarouselPosition();
    if (live != null) {
      const { index, progress } = carouselPositionToSection(live);
      if (
        index !== lastIndex ||
        Math.abs(progress - lastProgress) > SECTION_EPSILON
      ) {
        lastIndex = index;
        lastProgress = progress;
        setActiveSection(index, progress);
      }
      return;
    }

    const tops = getSeriesMarkerTops();
    if (!tops) return;

    if (isPastLastCapital(tops)) {
      if (lastIndex !== CAPITALS_DATA.length || lastProgress !== 0) {
        lastIndex = CAPITALS_DATA.length;
        lastProgress = 0;
        setActiveSection(CAPITALS_DATA.length, 0);
      }
      return;
    }

    const position = computeCarouselPositionFromMarkers(tops);
    const { index, progress } = carouselPositionToSection(position);
    if (
      index !== lastIndex ||
      Math.abs(progress - lastProgress) > SECTION_EPSILON
    ) {
      lastIndex = index;
      lastProgress = progress;
      setActiveSection(index, progress);
    }
  };

  let raf = 0;
  const tick = () => {
    syncFromMarkers();
    if (window.matchMedia(DESKTOP_MQ).matches) {
      applyCubeScrollMotion();
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  cleanups.push(() => cancelAnimationFrame(raf));

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
    resetCubeCanvasStyles();

    const pinTrigger = ScrollTrigger.create({
      trigger: "#six-capitals-intro",
      start: `top ${NAVBAR_OFFSET}px`,
      endTrigger: "#natural",
      end: `bottom ${NAVBAR_OFFSET}px`,
      pin: "#cube-canvas-container",
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnterBack: () => {
        showChapterCube();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      },
    });
    cleanups.push(() => pinTrigger.kill());

    const leadershipGuard = ScrollTrigger.create({
      trigger: "#leadership",
      start: "top 90%",
      onEnter: () => hideChapterCube(),
      onLeaveBack: () => {
        const six = document.getElementById("six-capitals");
        if (!six) return;
        const rect = six.getBoundingClientRect();
        if (rect.bottom > NAVBAR_OFFSET && rect.top < window.innerHeight) {
          showChapterCube();
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      },
      invalidateOnRefresh: true,
    });
    cleanups.push(() => leadershipGuard.kill());
  }

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
