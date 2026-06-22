import { useCallback, useState } from "react";
import type { PointerEvent } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowDown } from "lucide-react";
import { AnnualReportBookBlock } from "./AnnualReportBookBlock";
import { RubikCube3D } from "./RubikCube3D";
import { REPORT_META } from "../../features/annual-report/reportMockData";

export type ReportHeroVariant = "coming-soon" | "released";

interface ReportHeroShowcaseProps {
  variant?: ReportHeroVariant;
  className?: string;
  /** When true, hides the standalone chapter header (used inside First Page section). */
  embedded?: boolean;
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ReportHeroShowcase({
  variant = "released",
  className = "",
  embedded = false,
}: ReportHeroShowcaseProps) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const isComingSoon = variant === "coming-soon";

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  return (
    <div
      className={`report-hero relative overflow-visible ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className={`relative z-10 w-full max-w-6xl mx-auto ${embedded ? "px-0" : "px-4 sm:px-6 lg:px-8"}`}>
        {!isComingSoon && !embedded && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.08 }}
            className="mb-10 sm:mb-12 max-w-3xl"
          >
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
              <span className="h-px w-12 bg-gradient-to-r from-[#C5A059] to-transparent" />
              <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#C5A059] font-bold">
                01 / Entrance
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white leading-tight italic"
            >
              Welcome to Our Annual Report
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl">
              An immersive gateway into how Horana Plantations creates value across six
              integrated capitals.
            </motion.p>
          </motion.div>
        )}

        <div className="grid w-full items-center gap-12 overflow-visible lg:gap-14 lg:grid-cols-[1.08fr_auto]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto flex w-full max-w-[520px] flex-col items-center overflow-visible lg:items-start"
          >
            <div className="report-hero-book-stage relative w-full flex justify-center overflow-visible lg:justify-start">
              <div className="report-hero-pedestal" aria-hidden />
              <div className="report-hero-ring" aria-hidden />
              <AnnualReportBookBlock variant="hero" className="relative z-10" />
            </div>

            <div className="mt-6 max-w-[360px] text-center lg:text-left">
              <p className="report-hero-slogan font-serif text-2xl italic text-[#E5C079] sm:text-3xl">
                {REPORT_META.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
                Growth is achieved not by simplifying complexity, but by understanding how
                each move made to further a goal, affects the whole operation.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.12 }}
            className="mx-auto flex w-full max-w-xl flex-col items-center text-center lg:items-end lg:text-right"
          >
            <motion.p
              variants={fadeUp}
              className="font-mono text-[9px] uppercase tracking-[0.35em] text-zinc-500"
            >
              Move pointer to explore
            </motion.p>

            <motion.h3
              variants={fadeUp}
              className="mt-5 max-w-lg font-serif text-2xl font-bold leading-tight text-white sm:text-4xl"
            >
              {isComingSoon ? (
                <>
                  Our <span className="text-[#E5C079]">Six Capitals</span> journey is almost
                  ready
                </>
              ) : (
                <>
                  Our <span className="text-[#E5C079]">Six Capitals</span> journey
                </>
              )}
            </motion.h3>

            <motion.p
              variants={fadeUp}
              className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base"
            >
              {isComingSoon
                ? "The interactive annual report is being finalized — financial, manufactured, intellectual, human, social, and natural capital in one immersive experience."
                : `Explore our ${REPORT_META.year} integrated report — financial, manufactured, intellectual, human, social, and natural capital in one immersive experience.`}
            </motion.p>

            <motion.div variants={fadeUp} className="report-hero-cube-stage mt-4">
              <div className="report-hero-cube-glow" aria-hidden />
              <RubikCube3D
                mode="interactive"
                sizeMultiplier={1.1}
                parallax={parallax}
                className="relative z-10 cursor-grab active:cursor-grabbing"
              />
            </motion.div>
          </motion.div>
        </div>

        {!isComingSoon && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className={`${embedded ? "mt-8 sm:mt-10" : "mt-14 sm:mt-16"} flex flex-col items-center gap-2 text-[#C5A059]/60`}
          >
            <span className="text-[9px] font-mono uppercase tracking-[0.35em]">
              Scroll to explore chapters
            </span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </motion.div>
        )}
      </div>

      <style>{heroShowcaseStyles}</style>
    </div>
  );
}

const heroShowcaseStyles = `
  .report-hero-book-stage {
    min-height: 420px;
    width: 100%;
    overflow: visible;
    padding-left: clamp(2rem, 8vw, 5rem);
    padding-right: 1rem;
  }
  .report-hero-pedestal {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: min(90%, 360px);
    height: 110px;
    background: radial-gradient(ellipse at center, rgba(197,160,89,0.2) 0%, transparent 68%);
    filter: blur(26px);
    animation: report-hero-pulse 5s ease-in-out infinite;
  }
  .report-hero-ring {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    width: min(76%, 290px);
    height: 12px;
    border-radius: 50%;
    background: radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 72%);
    filter: blur(5px);
  }
  .report-hero-book-stage .book-container {
    padding: 16px 6px 24px !important;
    overflow: visible !important;
  }
  .report-hero-book-stage .book-outer.is-open {
    z-index: 50;
  }

  .report-hero-slogan {
    animation: report-hero-slogan-glow 3s ease-in-out infinite;
  }

  .report-hero-cube-stage {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 280px;
    width: 100%;
  }
  .report-hero-cube-glow {
    position: absolute;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(197,160,89,0.14) 0%, transparent 70%);
    filter: blur(30px);
    animation: report-hero-cube-pulse 4s ease-in-out infinite;
  }

  @keyframes report-hero-pulse {
    0%, 100% { opacity: 0.65; transform: translateX(-50%) scale(1); }
    50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
  }
  @keyframes report-hero-cube-pulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.08); }
  }
  @keyframes report-hero-slogan-glow {
    0%, 100% { text-shadow: 0 0 20px rgba(229,192,121,0.15); }
    50% { text-shadow: 0 0 32px rgba(229,192,121,0.35); }
  }

  @media (prefers-reduced-motion: reduce) {
    .report-hero-pedestal,
    .report-hero-cube-glow,
    .report-hero-slogan {
      animation: none !important;
    }
  }
`;
