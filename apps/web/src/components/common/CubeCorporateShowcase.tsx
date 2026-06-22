import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp, Sparkles, Coins, ChevronRight, Play, Pause, X, Check,
  BarChart3, Leaf,
} from "lucide-react";
import {
  SIMULATOR_REPORT_STREAMS,
  baseForecastFromStream,
  type ReportStreamId,
} from "../../features/dashboard/simulatorReportStreams";

interface AdItem {
  id: ReportStreamId;
  streamId: ReportStreamId;
  chapter: string;
  tag: string;
  title: string;
  shortDesc: string;
  heading: string;
  longDesc: string;
  stat: string;
  statLabel: string;
  color: string;
  glowColor: string;
  icon: React.ComponentType<{ className?: string }>;
  metrics: { label: string; value: string; trend?: string }[];
  sdg: string[];
}

const STREAM_ICONS: Record<ReportStreamId, React.ComponentType<{ className?: string }>> = {
  financial: Coins,
  "success-story": BarChart3,
  esg: Leaf,
};

const ADS_DATA: AdItem[] = SIMULATOR_REPORT_STREAMS.map((stream) => ({
  id: stream.id,
  streamId: stream.id,
  chapter: stream.chapter,
  tag: stream.tag,
  title: stream.title,
  shortDesc: `${stream.statLabel}: ${stream.stat} — ${stream.cards[0]?.changePercentage ?? ""} ${stream.cards[0]?.comparison ?? ""}`,
  heading: stream.headline,
  longDesc: stream.description,
  stat: stream.stat,
  statLabel: stream.statLabel,
  color: stream.color,
  glowColor: stream.glowColor,
  icon: STREAM_ICONS[stream.id],
  metrics: stream.metrics.map((m) => ({ label: m.label, value: m.value, trend: "up" as const })),
  sdg:
    stream.id === "financial"
      ? ["SDG 8: Decent Work & Growth", "SDG 12: Responsible Consumption"]
      : stream.id === "success-story"
        ? ["SDG 9: Industry & Innovation", "SDG 8: Economic Growth"]
        : ["SDG 13: Climate Action", "SDG 12: Responsible Production"],
}));

export function CubeCorporateShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedAd, setSelectedAd] = useState<AdItem | null>(null);

  // Simulation State inside detail modal
  const [simLevel, setSimLevel] = useState(50);
  const [forecastOutcome, setForecastOutcome] = useState({ revenue: 3950, earnings: 137, roe: 13.7 });

  useEffect(() => {
    if (!isPlaying || selectedAd) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ADS_DATA.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPlaying, selectedAd]);

  const activeAd = ADS_DATA[activeIndex];

  // Dynamic simulation engine based on metric level
  useEffect(() => {
    if (!selectedAd) return;
    const factor = simLevel / 100;
    const base = baseForecastFromStream(selectedAd.streamId);
    setForecastOutcome({
      revenue: Math.round(base.revenue * (0.92 + factor * 0.16)),
      earnings: Math.round(base.earnings * (0.9 + factor * 0.2)),
      roe: Math.round((13.7 * (0.95 + factor * 0.1)) * 10) / 10,
    });
  }, [simLevel, selectedAd]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Mini Top Banner Header */}
      <div className="flex items-center justify-between border-b border-[#C5A059]/15 pb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-[#C5A059] uppercase font-bold">
            Live Corporate Channel
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded bg-black/40 border border-white/5 text-zinc-400 hover:text-[#C5A059] transition-all cursor-pointer"
            title={isPlaying ? "Pause Stream" : "Play Stream"}
          >
            {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
          </button>
        </div>
      </div>

      {/* Main Stream Slider Card */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={() => {
              setSelectedAd(activeAd);
              setSimLevel(50);
            }}
            className="group relative overflow-hidden bg-[#030d07] border border-[#C5A059]/20 hover:border-[#C5A059]/60 rounded-2xl p-4 shadow-lg hover:shadow-[#C5A059]/5 transition-all cursor-pointer select-none"
            style={{
              boxShadow: `inset 0 0 15px ${activeAd.glowColor}`
            }}
          >
            {/* Top Tag indicator & visual live pulse */}
            <div className="flex justify-between items-center mb-2.5">
              <span 
                className="text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded border"
                style={{ 
                  color: activeAd.color, 
                  borderColor: `${activeAd.color}35`,
                  backgroundColor: `${activeAd.color}10` 
                }}
              >
                {activeAd.tag}
              </span>
              <div className="flex items-center gap-1 text-[8px] font-mono text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>AD {activeIndex + 1}/{ADS_DATA.length}</span>
              </div>
            </div>

            {/* Layout with Icon & Headline */}
            <div className="flex items-start gap-3.5 min-w-0">
              <div 
                className="p-2.5 rounded-xl border shrink-0 transition-all group-hover:scale-105"
                style={{ 
                  backgroundColor: `${activeAd.color}15`,
                  borderColor: `${activeAd.color}35`
                }}
              >
                {React.createElement(activeAd.icon as React.ComponentType<any>, {
                  className: "w-5 h-5",
                  color: activeAd.color
                })}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-white font-serif font-bold text-xs sm:text-sm tracking-wide leading-tight group-hover:text-[#C5A059] transition-colors truncate">
                  {activeAd.title}
                </h4>
                <p className="text-[10px] text-zinc-400 font-sans leading-relaxed mt-1 line-clamp-2">
                  {activeAd.shortDesc}
                </p>
              </div>
            </div>

            {/* Quick action helper bottom */}
            <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono uppercase text-zinc-500">
              <div className="flex items-center gap-1.5 text-[#C5A059] font-bold">
                <span>IMPACT</span>
                <span className="text-white">{activeAd.stat}</span>
              </div>
              <div className="flex items-center gap-0.5 text-[#C5A059] opacity-70 group-hover:opacity-100 transition-opacity">
                <span>Interactive details</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Ticker dots navigation */}
        <div className="flex justify-center gap-1.5 mt-2.5">
          {ADS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx 
                  ? "bg-[#C5A059] w-3.5" 
                  : "bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Corporate Prospectus Detail Overlay Modal */}
      <AnimatePresence>
        {selectedAd && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 select-none pointer-events-auto">
            {/* Backdrop dark blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAd(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Content Prospectus Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-2xl bg-gradient-to-b from-[#03140a] to-[#010502] border border-[#C5A059]/40 rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] flex flex-col text-left font-sans"
              style={{
                boxShadow: `0 0 40px ${selectedAd.color}15, inset 0 0 25px ${selectedAd.color}05, 0 25px 60px rgba(0,0,0,0.95)`
              }}
            >
              {/* Luxury gold accent line on top */}
              <div 
                className="h-1.5 w-full transition-all duration-300 shrink-0"
                style={{ backgroundColor: selectedAd.color }}
              />

              {/* Close Button top-right */}
              <button
                onClick={() => setSelectedAd(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-black/40 hover:bg-red-500 hover:text-black border border-white/5 hover:border-red-500/40 text-zinc-400 transition-all cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable Container */}
              <div className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6 scrollbar-thin">
                {/* Header Capital Division */}
                <div className="flex gap-4 items-center">
                  <div 
                    className="p-3.5 rounded-2xl border"
                    style={{ 
                      backgroundColor: `${selectedAd.color}15`,
                      borderColor: `${selectedAd.color}35`
                    }}
                  >
                    {React.createElement(selectedAd.icon as React.ComponentType<any>, {
                      className: "w-7 h-7",
                      color: selectedAd.color
                    })}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase font-bold">
                        CORPORATE DISCLOSURE 2026
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-mono text-zinc-400 uppercase font-semibold">
                        {selectedAd.chapter}
                      </span>
                    </div>
                    <h3 className="text-white font-serif font-black text-lg sm:text-2xl mt-0.5 leading-tight">
                      {selectedAd.heading}
                    </h3>
                  </div>
                </div>

                {/* Main Stat & Highlight Box */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Highlight Core Indicator */}
                  <div className="sm:col-span-2 bg-black/45 border border-white/5 rounded-2xl p-4.5 flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
                      KEY VALUE METRIC
                    </span>
                    <h2 
                      className="text-3xl sm:text-4xl font-display font-black tracking-tight"
                      style={{ color: selectedAd.color }}
                    >
                      {selectedAd.stat}
                    </h2>
                    <span className="text-xs text-zinc-300 font-sans font-medium mt-1">
                      {selectedAd.statLabel}
                    </span>
                  </div>

                  {/* Sustainable Development Compliance Badges */}
                  <div className="bg-[#040e08] border border-[#C5A059]/15 rounded-2xl p-4.5 space-y-2.5">
                    <span className="text-[8.5px] font-mono text-[#C5A059] uppercase tracking-wider font-bold block">
                      ☘️ Global SDG Targets:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {selectedAd.sdg.map((sdgLabel, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-1.5 text-[10px] text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{sdgLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Long Editorial Article */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase border-b border-white/5 pb-1">
                    EXECUTIVE SUMMARY & BUSINESS IMPACT
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans first-letter:text-2xl first-letter:font-serif first-letter:text-[#C5A059] first-letter:font-bold">
                    {selectedAd.longDesc}
                  </p>
                </div>

                {/* Sub-capitals Table Metrics */}
                <div className="space-y-2 bg-black/45 rounded-2xl p-4 border border-white/5">
                  <h5 className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider block mb-2">
                    Verified Operating Metrics Portfolio
                  </h5>
                  <div className="grid grid-cols-3 gap-2.5">
                    {selectedAd.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className="flex flex-col border-r border-white/5 last:border-none pr-2">
                        <span className="text-[8.5px] text-zinc-500 uppercase truncate">
                          {metric.label}
                        </span>
                        <span className="text-zinc-100 font-mono font-bold text-sm sm:text-base mt-1 flex items-center gap-1">
                          {metric.value}
                          {metric.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-400 inline" />}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PRO-UX Interactive Simulation Area: Forecast Projections */}
                <div className="bg-[#05130b] border border-emerald-500/20 rounded-2xl p-4.5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-[10px] font-mono text-[#C5A059] tracking-wider uppercase font-bold">
                        Interactive Impact Modeler
                      </h5>
                      <span className="text-[9px] text-zinc-400">
                        Adjust cap investment level to preview ESG & economic forecasts.
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                      Interactive Sim
                    </span>
                  </div>

                  {/* Slider Input */}
                  <div className="flex items-center gap-3 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase shrink-0">
                      Standard (50%)
                    </span>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={simLevel}
                      onChange={(e) => setSimLevel(parseInt(e.target.value))}
                      className="flex-grow accent-[#C5A059] cursor-pointer"
                    />
                    <span 
                      className="text-xs font-mono font-bold shrink-0 w-10 text-right"
                      style={{ color: selectedAd.color }}
                    >
                      {simLevel}%
                    </span>
                  </div>

                  {/* Simulated Output Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-1">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8.5px] text-zinc-500 uppercase block">Revenue Outlook</span>
                      <span className="text-xs font-mono font-bold text-[#C5A059] block mt-1">
                        {forecastOutcome.revenue} Mn
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8.5px] text-zinc-500 uppercase block">Earnings Outlook</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 block mt-1">
                        {forecastOutcome.earnings} Mn
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-center">
                      <span className="text-[8.5px] text-zinc-500 uppercase block">ROE Scenario</span>
                      <span className="text-xs font-mono font-bold text-cyan-400 block mt-1">
                        {forecastOutcome.roe}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prospectus Footer panel */}
              <div className="p-4 bg-black/55 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2.5 shrink-0 text-center sm:text-left">
                <p className="text-[9px] font-mono text-zinc-500 uppercase">
                  Audited by Ernst & Young • ISO 14001 Standards Registry
                </p>
                <button
                  onClick={() => setSelectedAd(null)}
                  className="px-5 py-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-xl bg-[#C5A059] hover:bg-[#b08b47] hover:shadow-lg text-black transition-all cursor-pointer"
                >
                  Return to Strategy Cube
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
