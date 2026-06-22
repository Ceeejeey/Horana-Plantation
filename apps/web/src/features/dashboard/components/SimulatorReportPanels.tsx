import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowUpRight,
  BarChart3,
  Coins,
  FileSpreadsheet,
  Leaf,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { TenYearSummaryDashboard } from "../../annual-report/components/TenYearSummaryDashboard";
import { SIMULATOR_REPORT_STREAMS, type ReportStreamId } from "../simulatorReportStreams";

const TAB_META: Record<
  ReportStreamId,
  { icon: typeof Coins; accent: string }
> = {
  financial: { icon: Coins, accent: "#C5A059" },
  "success-story": { icon: BarChart3, accent: "#10B981" },
  esg: { icon: Leaf, accent: "#34D399" },
};

function valueSuffix(title: string): string {
  if (title.includes("Rs' 000")) return "Mn";
  if (title.includes("Rs. Cts.")) return "Cts.";
  if (title.includes("Times")) return "×";
  if (title.includes("%")) return "%";
  return "";
}

export function SimulatorReportPanels() {
  const [activeTab, setActiveTab] = useState<ReportStreamId>("financial");
  const stream = SIMULATOR_REPORT_STREAMS.find((s) => s.id === activeTab)!;
  const TabIcon = TAB_META[activeTab].icon;

  return (
    <section className="mb-12">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/8 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
          <FileSpreadsheet className="h-3 w-3" />
          Audited Annual Report Data
        </span>
        <h3 className="font-serif text-2xl italic text-white sm:text-3xl">
          Report Streams ·{" "}
          <span className="text-[#E5C079] not-italic">Financial · Graphs · ESG</span>
        </h3>
        <p className="max-w-2xl font-mono text-[10px] uppercase leading-relaxed tracking-wider text-zinc-500">
          Live figures from Financial Performance, Ten Year Success Story graphs and ESG
          indicators — same data as the home page annual report chapters.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {SIMULATOR_REPORT_STREAMS.map((s) => {
          const Icon = TAB_META[s.id].icon;
          const isActive = activeTab === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveTab(s.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? "border-[#C5A059]/50 bg-[#C5A059]/15 text-[#E5C079] shadow-[0_0_24px_rgba(197,160,89,0.15)]"
                  : "border-white/10 bg-white/[0.02] text-zinc-500 hover:border-[#C5A059]/30 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {s.chapter}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-2xl border border-[#C5A059]/20 bg-gradient-to-br from-[#0B2118]/90 via-[#05110c] to-[#040a07] shadow-[0_28px_70px_rgba(0,0,0,0.45)]"
        >
          <div
            className="h-1 w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${stream.color}, transparent)` }}
          />

          <div className="border-b border-white/8 p-5 sm:p-6">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
                style={{
                  borderColor: `${stream.color}44`,
                  backgroundColor: `${stream.color}15`,
                }}
              >
                <TabIcon className="h-6 w-6" style={{ color: stream.color }} />
              </div>
              <div className="flex-1">
                <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
                  {stream.chapter}
                </p>
                <h4 className="mt-1 font-serif text-xl text-white sm:text-2xl">{stream.title}</h4>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">{stream.description}</p>
              </div>
              <div className="shrink-0 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-center">
                <p className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">{stream.statLabel}</p>
                <p className="font-serif text-2xl font-bold" style={{ color: stream.color }}>
                  {stream.stat}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
            {stream.cards.map((card, index) => {
              const suffix = valueSuffix(card.title);
              return (
                <motion.article
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/25 p-4 text-center transition-colors hover:border-[#C5A059]/30"
                >
                  <p className="font-mono text-[9px] font-semibold uppercase leading-snug tracking-wider text-zinc-500">
                    {card.title}
                  </p>
                  <div className="mt-3 flex items-end justify-center gap-1.5">
                    <span className="font-serif text-3xl font-bold text-white">{card.value}</span>
                    {suffix && (
                      <span className="mb-1 font-mono text-[10px] font-bold uppercase text-[#C5A059]">
                        {suffix}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col items-center gap-1 border-t border-white/8 pt-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />
                      {card.changePercentage}
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-600">
                      {card.comparison}
                    </span>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {activeTab === "success-story" && (
            <div className="border-t border-white/8 p-4 sm:p-6">
              <div className="mb-4 flex items-center justify-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#C5A059]" />
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#C5A079]">
                  Interactive Ten Year Charts
                </span>
              </div>
              <TenYearSummaryDashboard variant="compact" defaultCategory="operating" defaultMetricId="revenue" />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/8 px-5 py-4 sm:px-6">
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
            <span className="font-mono text-[8px] uppercase tracking-wider text-zinc-500">
              Source: Horana Plantations PLC · Ten Year Summary &amp; FY 25/26 audited highlights
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
