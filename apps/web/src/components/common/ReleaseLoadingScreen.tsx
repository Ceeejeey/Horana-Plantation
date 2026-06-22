import { useCallback, useEffect, useRef, useState } from "react";
import { easeInOutCubic } from "../../features/cube-animation/utils/cubeRotationHelpers";
import { RubikCube3D } from "./RubikCube3D";

/** Full layer-by-layer solve — loading ends only after this + brief solved hold. */
const SOLVE_DURATION_MS = 7200;
const SOLVED_HOLD_MS = 1000;
const MAX_WAIT_MS = 14000;
const ZOOM_DURATION_MS = 1100;
type LoadingPhase =
  | "init"
  | "scramble"
  | "align"
  | "layer1"
  | "layer2"
  | "layer3"
  | "layer4"
  | "layer5"
  | "solve"
  | "matters"
  | "ready";

function getLoadingPhase(progress: number): LoadingPhase {
  if (progress < 0.05) return "init";
  if (progress < 0.11) return "scramble";
  if (progress < 0.18) return "align";
  if (progress < 0.28) return "layer1";
  if (progress < 0.38) return "layer2";
  if (progress < 0.48) return "layer3";
  if (progress < 0.58) return "layer4";
  if (progress < 0.68) return "layer5";
  if (progress < 0.78) return "solve";
  if (progress < 0.93) return "matters";
  return "ready";
}

export interface ReleaseLoadingScreenProps {
  onComplete: () => void;
  releaseReady: boolean;
}

export function ReleaseLoadingScreen({ onComplete, releaseReady }: ReleaseLoadingScreenProps) {
  const [solveProgress, setSolveProgress] = useState(0);
  const [phase, setPhase] = useState<"intro" | "zoom">("intro");
  const [titleVisible, setTitleVisible] = useState(false);
  const solveDoneRef = useRef(false);
  const finishedRef = useRef(false);
  const introStartRef = useRef(performance.now());

  useEffect(() => {
    const t = window.setTimeout(() => setTitleVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const linear = Math.min(1, (now - start) / SOLVE_DURATION_MS);
      setSolveProgress(easeInOutCubic(linear));
      if (linear >= 1) solveDoneRef.current = true;
      if (linear < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const tryFinish = useCallback(() => {
    if (finishedRef.current) return;
    const elapsed = performance.now() - introStartRef.current;
    const solveTimelineDone = elapsed >= SOLVE_DURATION_MS + SOLVED_HOLD_MS;
    const canProceed =
      solveDoneRef.current &&
      solveTimelineDone &&
      (releaseReady || elapsed >= MAX_WAIT_MS);
    if (!canProceed) return;
    finishedRef.current = true;
    setPhase("zoom");
    window.setTimeout(onComplete, ZOOM_DURATION_MS);
  }, [onComplete, releaseReady]);

  useEffect(() => {
    tryFinish();
  }, [solveProgress, releaseReady, tryFinish]);

  useEffect(() => {
    const id = window.setInterval(tryFinish, 200);
    return () => clearInterval(id);
  }, [tryFinish]);

  const loadingPhase = getLoadingPhase(solveProgress);

  return (
    <div
      className={`intro-shell fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[#05110c] px-4 transition-all ease-[cubic-bezier(0.4,0,0.2,1)] ${
        phase === "zoom" ? "scale-[2.8] opacity-0 blur-sm" : "scale-100 opacity-100 blur-0"
      }`}
      style={{ transitionDuration: `${ZOOM_DURATION_MS}ms` }}
    >
      <IntroBackground />

      <div className="relative z-50 flex w-full max-w-lg flex-col items-center">
        <IntroTitle visible={titleVisible} />

        <RubikCube3D
          mode="loading"
          solveProgress={solveProgress}
          sizeMultiplier={1.62}
          className="my-2 sm:my-4"
        />

        <LoadingStatusText phase={loadingPhase} />

        <LoadingStepDots phase={loadingPhase} progress={solveProgress} />

        <div className="mt-4 h-1 w-44 overflow-hidden rounded-full bg-white/8 sm:w-56">
          <div
            className="intro-progress-bar h-full rounded-full bg-linear-to-r from-[#8B7340] via-[#C5A059] to-[#E5C079]"
            style={{ width: `${Math.max(8, solveProgress * 100)}%` }}
          />
        </div>
      </div>

      <style>{introStyles}</style>
    </div>
  );
}

function IntroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="intro-bg-mesh absolute -inset-[40%] opacity-80" />
      <div className="intro-bg-grid absolute inset-0 opacity-[0.14]" />
      <div className="intro-bg-vignette absolute inset-0" />

      <div className="intro-bg-orb intro-bg-orb--1 absolute left-[8%] top-[18%] h-48 w-48 sm:h-64 sm:w-64" />
      <div className="intro-bg-orb intro-bg-orb--2 absolute right-[6%] top-[28%] h-40 w-40 sm:h-56 sm:w-56" />
      <div className="intro-bg-orb intro-bg-orb--3 absolute bottom-[12%] left-[20%] h-36 w-36 sm:h-52 sm:w-52" />
      <div className="intro-bg-orb intro-bg-orb--4 absolute bottom-[18%] right-[14%] h-44 w-44 sm:h-60 sm:w-60" />

      <div className="intro-bg-ring intro-bg-ring--1 absolute left-1/2 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C5A059]/10" />
      <div className="intro-bg-ring intro-bg-ring--2 absolute left-1/2 top-1/2 h-[min(70vw,400px)] w-[min(70vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />

      <div className="intro-bg-scan absolute inset-0 opacity-[0.07]" />
    </div>
  );
}

const STATUS_COPY: Record<LoadingPhase, string> = {
  init: "Initializing capitals…",
  scramble: "Six capitals in the mix…",
  align: "Aligning the cube…",
  layer1: "Financial layer turning…",
  layer2: "Manufactured layer turning…",
  layer3: "Intellectual layer turning…",
  layer4: "Human layer turning…",
  layer5: "Social & natural layers…",
  solve: "Final solve in progress…",
  matters: "Solving the cube…",
  ready: "Report ready",
};

const STEP_PHASES: LoadingPhase[] = [
  "init",
  "scramble",
  "align",
  "layer1",
  "layer2",
  "layer3",
  "layer4",
  "layer5",
  "solve",
  "matters",
  "ready",
];

function LoadingStepDots({
  phase,
  progress,
}: {
  phase: LoadingPhase;
  progress: number;
}) {
  const activeIndex = STEP_PHASES.indexOf(phase);

  return (
    <div
      className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
      aria-hidden
    >
      {STEP_PHASES.map((step, i) => {
        const isActive = i === activeIndex;
        const isDone = i < activeIndex || (step === "ready" && progress >= 1);
        return (
          <span
            key={step}
            className={`intro-step-dot h-1.5 rounded-full transition-all duration-500 ease-out ${
              isActive
                ? "w-5 bg-[#C5A059] shadow-[0_0_10px_rgba(197,160,89,0.65)]"
                : isDone
                  ? "w-1.5 bg-[#C5A059]/55"
                  : "w-1.5 bg-white/15"
            }`}
          />
        );
      })}
    </div>
  );
}

function LoadingStatusText({ phase }: { phase: LoadingPhase }) {
  const showMatters = phase === "matters" || phase === "ready";
  const showPrimary = !showMatters;

  return (
    <div className="relative mt-1 flex min-h-[4.5rem] w-full max-w-md flex-col items-center justify-center px-2">
      <div className="relative w-full text-center">
        {showPrimary && (
          <p
            key={phase}
            className="intro-status-line font-mono text-[10px] uppercase tracking-[0.28em] text-[#C5A059]/85 sm:text-[11px]"
          >
            {STATUS_COPY[phase]}
          </p>
        )}

        {showMatters && (
          <div key="matters-block" className="intro-status-matters flex flex-col items-center gap-2.5">
            {phase === "matters" && (
              <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#C5A059]/55">
                Solving the cube…
              </p>
            )}
            <p
              className="intro-matters-tagline font-serif text-xl font-semibold italic leading-snug sm:text-2xl"
              aria-live="polite"
            >
              <span className="intro-matters-word" style={{ animationDelay: "0ms" }}>
                Every
              </span>{" "}
              <span className="intro-matters-word" style={{ animationDelay: "0.1s" }}>
                move
              </span>{" "}
              <span className="intro-matters-word" style={{ animationDelay: "0.2s" }}>
                matters
              </span>
            </p>
            <div className="intro-matters-rule h-px w-28 bg-linear-to-r from-transparent via-[#C5A059]/80 to-transparent" />
            {phase === "ready" && (
              <p className="intro-status-line mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#C5A059]/75">
                Report ready
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function IntroTitle({ visible }: { visible: boolean }) {
  return (
    <div
      className={`mb-6 text-center transition-all duration-1000 sm:mb-8 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <p className="intro-title-shine font-mono text-[10px] uppercase tracking-[0.42em] text-[#C5A059]/90 sm:text-[11px]">
        Horana Plantations
      </p>
      <h1 className="mt-3 font-serif text-2xl font-bold leading-tight text-white sm:text-4xl md:text-5xl">
        <span className="intro-line block" style={{ animationDelay: "0.15s" }}>
          Annual Report
        </span>
        <span
          className="intro-line mt-1 block bg-linear-to-r from-[#E5C079] via-[#C5A059] to-[#8B7340] bg-clip-text text-transparent"
          style={{ animationDelay: "0.35s" }}
        >
          25/26
        </span>
      </h1>
      <div className="mx-auto mt-4 h-px w-24 bg-linear-to-r from-transparent via-[#C5A059]/60 to-transparent" />
    </div>
  );
}

const introStyles = `
  @keyframes intro-line-in {
    from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
    to { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes intro-shine {
    0%, 100% { opacity: 0.75; }
    50% { opacity: 1; }
  }
  @keyframes intro-bg-shift {
    0% { transform: translate(-5%, -4%) rotate(0deg) scale(1.05); }
    50% { transform: translate(4%, 3%) rotate(180deg) scale(1.12); }
    100% { transform: translate(-5%, -4%) rotate(360deg) scale(1.05); }
  }
  @keyframes intro-orb-drift {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.35; }
    50% { transform: translate(12px, -18px) scale(1.08); opacity: 0.55; }
  }
  @keyframes intro-ring-spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes intro-ring-spin-rev {
    0% { transform: translate(-50%, -50%) rotate(360deg); }
    100% { transform: translate(-50%, -50%) rotate(0deg); }
  }
  @keyframes intro-scan-sweep {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }
  @keyframes intro-status-in {
    from {
      opacity: 0;
      transform: translateY(10px);
      filter: blur(6px);
      letter-spacing: 0.38em;
    }
    to {
      opacity: 1;
      transform: translateY(0);
      filter: blur(0);
      letter-spacing: 0.28em;
    }
  }
  @keyframes intro-matters-word-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.94);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
  @keyframes intro-matters-glow {
    0%, 100% { text-shadow: 0 0 20px rgba(197, 160, 89, 0.25); }
    50% { text-shadow: 0 0 32px rgba(229, 192, 121, 0.55), 0 0 48px rgba(197, 160, 89, 0.2); }
  }
  @keyframes intro-matters-rule-in {
    from { opacity: 0; transform: scaleX(0); }
    to { opacity: 1; transform: scaleX(1); }
  }
  .intro-status-line {
    animation: intro-status-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .intro-status-matters {
    animation: intro-status-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .intro-matters-tagline {
    color: #E5C079;
    animation: intro-matters-glow 2s ease-in-out infinite;
  }
  .intro-matters-word {
    display: inline-block;
    opacity: 0;
    color: #E5C079;
    animation: intro-matters-word-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .intro-matters-rule {
    opacity: 0;
    animation: intro-matters-rule-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.28s forwards;
  }
  .intro-line {
    opacity: 0;
    animation: intro-line-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .intro-title-shine {
    animation: intro-shine 1.8s ease-in-out infinite;
  }
  .intro-progress-bar {
    transition: none;
    box-shadow: 0 0 14px rgba(197, 160, 89, 0.5);
  }
  .intro-bg-mesh {
    background:
      radial-gradient(ellipse 55% 45% at 20% 30%, rgba(197, 160, 89, 0.18), transparent 55%),
      radial-gradient(ellipse 50% 40% at 78% 65%, rgba(16, 185, 129, 0.12), transparent 50%),
      radial-gradient(ellipse 60% 50% at 50% 50%, rgba(11, 33, 24, 0.9), rgba(5, 17, 12, 1));
    animation: intro-bg-shift 18s linear infinite;
  }
  .intro-bg-grid {
    background-image:
      linear-gradient(rgba(197, 160, 89, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(197, 160, 89, 0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 72%);
  }
  .intro-bg-vignette {
    background: radial-gradient(ellipse at center, transparent 35%, rgba(5, 17, 12, 0.85) 100%);
  }
  .intro-bg-orb {
    border-radius: 9999px;
    filter: blur(40px);
    animation: intro-orb-drift 5s ease-in-out infinite;
  }
  .intro-bg-orb--1 { background: rgba(197, 160, 89, 0.22); animation-delay: 0s; }
  .intro-bg-orb--2 { background: rgba(16, 185, 129, 0.18); animation-delay: -1.2s; }
  .intro-bg-orb--3 { background: rgba(197, 160, 89, 0.14); animation-delay: -2.4s; }
  .intro-bg-orb--4 { background: rgba(34, 197, 94, 0.12); animation-delay: -0.8s; }
  .intro-bg-ring--1 { animation: intro-ring-spin 22s linear infinite; }
  .intro-bg-ring--2 { animation: intro-ring-spin-rev 16s linear infinite; }
  .intro-bg-scan {
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(197, 160, 89, 0.12) 48%,
      transparent 100%
    );
    animation: intro-scan-sweep 4s linear infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .intro-line,
    .intro-status-line,
    .intro-status-matters,
    .intro-matters-word,
    .intro-matters-rule,
    .intro-matters-tagline {
      opacity: 1;
      animation: none;
      transform: none;
      filter: none;
    }
    .intro-shell { transition: opacity 0.4s !important; transform: none !important; }
    .intro-bg-mesh, .intro-bg-orb, .intro-bg-ring--1, .intro-bg-ring--2, .intro-bg-scan { animation: none; }
  }
`;
