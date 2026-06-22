import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Users2 } from "lucide-react";
import { ReportSectionShell } from "./ReportSectionShell";
import { LeadershipCard } from "./LeadershipCard";
import { CHAIRMAN_MESSAGE, MD_REVIEW } from "../reportMockData";

const LEADERS = [
  { id: "chairman-message", leader: CHAIRMAN_MESSAGE, variant: "gold" as const },
  { id: "md-review", leader: MD_REVIEW, variant: "emerald" as const },
];

export function LeadershipSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, amount: 0.1 });
  const [mobileIndex, setMobileIndex] = useState(0);

  return (
    <ReportSectionShell
      id="leadership"
      chapter="05 / Leadership"
      title="Executive Leadership"
      subtitle="Perspectives from our Chairman and Managing Director on governance, systemic balance, and the integrated path forward."
      align="center"
      contentClassName="max-w-6xl"
    >
      <motion.div
        ref={gridRef}
        initial={{ opacity: 0 }}
        animate={gridInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="relative w-full"
      >
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-64 w-64 rounded-full bg-[#C5A059]/[0.04] blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-emerald-500/[0.04] blur-[90px]" aria-hidden />

        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-[#C5A059]/60 sm:block" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={gridInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#C5A059]/25 bg-[#0B2118]/70 px-5 py-2 shadow-[0_0_30px_rgba(197,160,89,0.08)] backdrop-blur-md"
          >
            <Users2 className="h-4 w-4 text-[#C5A059]" />
            <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-[#E5C079]">
              Board of Directors
            </span>
          </motion.div>
          <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-[#C5A059]/60 sm:block" />
        </div>

        {/* Mobile: swipeable single card with nav */}
        <div className="xl:hidden">
          <div className="mb-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setMobileIndex((i) => (i === 0 ? 1 : 0))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A059]/30 bg-[#0B2118]/80 text-[#C5A059] transition-colors hover:bg-[#C5A059]/15 cursor-pointer"
              aria-label="Previous leader"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              {LEADERS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMobileIndex(i)}
                  aria-label={`View leader ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    mobileIndex === i
                      ? "w-8 bg-[#C5A059]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setMobileIndex((i) => (i === 1 ? 0 : 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C5A059]/30 bg-[#0B2118]/80 text-[#C5A059] transition-colors hover:bg-[#C5A059]/15 cursor-pointer"
              aria-label="Next leader"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mobileIndex}
              initial={{ opacity: 0, x: mobileIndex === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mobileIndex === 0 ? 40 : -40 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <LeadershipCard
                id={LEADERS[mobileIndex].id}
                leader={LEADERS[mobileIndex].leader}
                variant={LEADERS[mobileIndex].variant}
                index={mobileIndex}
              />
            </motion.div>
          </AnimatePresence>

          <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            {LEADERS[mobileIndex].leader.role} · Swipe or tap to explore
          </p>
        </div>

        {/* Desktop: side-by-side grid */}
        <div className="hidden gap-8 xl:grid xl:grid-cols-2 xl:gap-7">
          {LEADERS.map((item, index) => (
            <LeadershipCard
              key={item.id}
              id={item.id}
              leader={item.leader}
              variant={item.variant}
              index={index}
            />
          ))}
        </div>
      </motion.div>
    </ReportSectionShell>
  );
}
