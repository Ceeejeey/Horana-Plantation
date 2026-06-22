import { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import { ReportSectionShell } from "./ReportSectionShell";
import { ReportPdfActions } from "./ReportMediaActions";
import {
  AnimatedChangePercent,
  AnimatedHighlightValue,
  performanceBannerVariants,
  performanceCardVariants,
  performanceContainerVariants,
} from "./PerformanceHighlightAnimations";
import { ESG_HIGHLIGHTS, type FinancialHighlight } from "../reportMockData";

const ESG_ICONS = [Sprout, ShieldCheck, Leaf, Sprout] as const;

function valueSuffix(title: string): string {
  if (title.includes("Rs' 000")) return "Mn";
  if (title.includes("Rs. Cts.")) return "Cts.";
  return "";
}

function EsgHighlightCard({
  item,
  index,
}: {
  item: FinancialHighlight;
  index: number;
}) {
  const isUp = item.trend === "up";
  const suffix = valueSuffix(item.title);
  const Icon = ESG_ICONS[index % ESG_ICONS.length];

  return (
    <motion.article
      custom={index}
      variants={performanceCardVariants}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
      className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#163026]/95 via-[#0d211a] to-[#071710] p-5 text-center shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:p-6"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -120 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + index * 0.1, type: "spring", stiffness: 260, damping: 18 }}
          className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10"
        >
          <Icon className="h-4 w-4 text-emerald-400" />
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 + index * 0.08, duration: 0.5 }}
          className="font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-500/70"
        >
          0{index + 1} · ESG Indicator
        </motion.span>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 + index * 0.08 }}
          className="mt-3 font-mono text-[10px] font-semibold uppercase leading-snug tracking-wider text-zinc-400"
        >
          {item.title}
        </motion.p>

        <div className="mt-4 flex items-end justify-center gap-2">
          <p className="bg-gradient-to-b from-white to-emerald-200/90 bg-clip-text font-serif text-4xl font-bold leading-none text-transparent sm:text-[2.75rem]">
            <AnimatedHighlightValue
              value={item.value}
              delay={0.2 + index * 0.12}
              duration={1.4}
            />
          </p>
          {suffix && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.55 + index * 0.1, duration: 0.45 }}
              className="mb-1 font-mono text-xs font-bold uppercase tracking-wider text-emerald-300/80"
            >
              {suffix}
            </motion.span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 + index * 0.1, duration: 0.5 }}
          className="mt-5 flex w-full flex-col items-center gap-2 border-t border-white/8 pt-4 sm:flex-row sm:justify-center sm:gap-4"
        >
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-xs font-bold ${
              isUp
                ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border border-red-500/25 bg-red-500/10 text-red-400"
            }`}
          >
            {isUp ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            <AnimatedChangePercent change={item.changePercentage} delay={0.5 + index * 0.1} />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">
            {item.comparison}
          </span>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-transparent"
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 + index * 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: [0.35, 0.85, 0.35], scale: 1 }}
        viewport={{ once: true }}
        transition={{
          opacity: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 + index * 0.1 },
          scale: { delay: 0.4 + index * 0.1, type: "spring", stiffness: 300, damping: 20 },
        }}
        className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/8 px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider text-[#C5A059]"
      >
        <Sparkles className="h-2 w-2" />
        FY 25/26
      </motion.span>
    </motion.article>
  );
}

export function EsgPerformanceSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.15 });

  return (
    <ReportSectionShell
      id="esg-performance"
      chapter="09 / ESG"
      title="ESG Performance"
      subtitle="Integrated environmental, social and governance outcomes — profitability, shareholder value and sustainable capital growth for 2025/26."
      align="center"
      contentClassName="max-w-4xl"
    >
      <motion.div
        ref={gridRef}
        variants={performanceContainerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
      >
        {ESG_HIGHLIGHTS.map((item, index) => (
          <EsgHighlightCard key={item.title} item={item} index={index} />
        ))}
      </motion.div>

      <motion.div
        variants={performanceBannerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mb-8 flex flex-col items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-4 py-4 text-center"
      >
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-emerald-400" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-400">
            Regenerate Framework Alignment
          </span>
        </div>
        <p className="max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-wider text-zinc-400">
          All four indicators reflect positive momentum against the prior reporting period — underpinning
          our commitment to balanced value creation across people, planet and governance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <ReportPdfActions
          title="ESG Performance — Annual Report 2025/26"
          sectionNote="PDF opens full report — navigate to ESG Performance"
          centered
        />
      </motion.div>
    </ReportSectionShell>
  );
}
