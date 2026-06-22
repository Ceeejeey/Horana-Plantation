import React, { useState, useRef, useMemo } from "react";
import { 
  TrendingUp, Leaf, BarChart3, HelpCircle, ArrowUpRight, Zap, 
  Coins, Sparkles, AlertCircle, Info, ShieldCheck, Milestone
} from "lucide-react";
import { buildSimulatorTrendData, getTrendValueBounds, type SimulatorTrendPoint } from "../simulatorChartData";
import { FINANCIAL_HIGHLIGHTS, ESG_HIGHLIGHTS } from "../../annual-report/reportMockData";
import { getMetricById } from "../../annual-report/tenYearSummaryData";

export function GlassTiltCard() {
  const [activeTab, setActiveTab] = useState<"both" | "financial" | "esg">("both");
  const cardRef = useRef<HTMLDivElement>(null);
  const GROWTH_DATA = useMemo(() => buildSimulatorTrendData(), []);
  const { min: minVal, max: maxVal } = useMemo(
    () => getTrendValueBounds(GROWTH_DATA),
    [GROWTH_DATA],
  );
  const latestRevenue = FINANCIAL_HIGHLIGHTS[0];
  const latestRoe = getMetricById("roe")?.values["2025/26"];
  const latestGross = ESG_HIGHLIGHTS[0];
  const latestEps = ESG_HIGHLIGHTS[2];

  // Rotate & shine coordinates state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Compute 3D Tilt parameters on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Get cursor position relative to card center (range: -1 to 1)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Apply maximum 12 degrees tilt
    const degX = (mouseY / (height / 2)) * -10; // invert X axis flip for logical lookups
    const degY = (mouseX / (width / 2)) * 10;

    setRotateX(degX);
    setRotateY(degY);

    // Calculate light spot shine percentage
    const spotX = ((e.clientX - rect.left) / width) * 100;
    const spotY = ((e.clientY - rect.top) / height) * 100;
    setShinePos({ x: spotX, y: spotY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setShinePos({ x: 50, y: 50 }); // Reset to center
  };

  // Compute SVG plotting path coordinates
  // Width: 500px, Height: 180px
  const svgWidth = 500;
  const svgHeight = 180;
  const padding = 20;

  const minValStatic = minVal;
  const maxValStatic = maxVal;

  const getPoints = (key: "financial" | "esg") => {
    const points: string[] = [];
    const step = (svgWidth - padding * 2) / (GROWTH_DATA.length - 1);

    GROWTH_DATA.forEach((d: SimulatorTrendPoint, i: number) => {
      const x = padding + i * step;
      const val = d[key];
      // Normalize values to fit SVG height flipped
      const y = svgHeight - padding - ((val - minValStatic) / (maxValStatic - minValStatic)) * (svgHeight - padding * 2);
      points.push(`${x},${y}`);
    });

    return points.join(" ");
  };

  const financialPoints = getPoints("financial");
  const esgPoints = getPoints("esg");

  return (
    <div 
      className="w-full relative py-6"
      style={{ perspective: "1000px" }}
      id="3d-glass-tilt-perspective-wrapper"
    >
      
      {/* Absolute Under-Glow Aura following current state */}
      <div 
        className="absolute -inset-2 bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-cyan-500/10 rounded-3xl blur-2xl -z-10 transition-opacity duration-500"
        style={{ opacity: isHovered ? 0.8 : 0.4 }}
      ></div>

      {/* Main Tilt Responsive Board */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full rounded-2xl p-6 relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] select-none border border-white/10"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? "20px" : "0px"})`,
          transformStyle: "preserve-3d",
          background: "linear-gradient(135deg, rgba(8, 12, 18, 0.75) 0%, rgba(13, 19, 28, 0.6) 100%)",
          backdropFilter: "blur(24px) saturate(140%)",
          boxShadow: isHovered
            ? "0 30px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)"
            : "0 15px 35px -10px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        id="3d-glass-tilt-card-body"
      >
        {/* Dynamic Light Shine overlay track */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-color-dodge transition-opacity duration-300 rounded-2xl"
          style={{
            background: `radial-gradient(circle 240px at ${shinePos.x}% ${shinePos.y}%, rgba(255, 255, 255, 0.22) 0%, transparent 80%)`,
          }}
        ></div>

        {/* Top Header Row with Glass Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest text-[#C5A059] uppercase mb-1">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              Ten Year Summary · Audited Data
            </div>
            <h4 className="text-xl font-serif text-white italic tracking-tight leading-none">
              Revenue & <span className="text-[#C5A059] not-italic font-bold">Gross Profit Trajectory</span>
            </h4>
            <p className="mt-1.5 font-mono text-[9px] text-zinc-500">
              FY 25/26 Revenue {latestRevenue.value} Mn ({latestRevenue.changePercentage})
              {latestRoe != null ? ` · ROE ${latestRoe}%` : ""}
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-950/40 border border-white/5 rounded-lg text-[10.5px] font-mono">
            <button
              onClick={() => setActiveTab("both")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === "both" 
                  ? "bg-[#C5A059]/20 text-white font-bold border border-[#C5A059]/30" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Hybrid
            </button>
            <button
              onClick={() => setActiveTab("financial")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === "financial" 
                  ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("esg")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                activeTab === "esg" 
                  ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Gross Profit
            </button>
          </div>
        </div>

        {/* Middle Plot Canvas Row using Spline lines with animated glow dashes */}
        <div className="relative h-[210px] w-full mt-2 flex items-center justify-center overflow-hidden">
          
          {/* Background grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-full border-t border-dashed border-white"></div>
            ))}
          </div>

          <svg 
            viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
            className="w-full h-full overflow-visible drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Financial Series Colors */}
              <linearGradient id="financialGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="financialStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D97706" />
                <stop offset="50%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>

              {/* Carbon / ESG Series Colors */}
              <linearGradient id="esgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="esgStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#34D399" />
              </linearGradient>
            </defs>

            {/* Financial Series Filled Polygon Layer */}
            {(activeTab === "both" || activeTab === "financial") && (
              <>
                <polyline
                  fill="url(#financialGrad)"
                  stroke="none"
                  points={`${padding},${svgHeight - padding} ${financialPoints} ${svgWidth - padding},${svgHeight - padding}`}
                  className="transition-all duration-700"
                />
                <polyline
                  fill="none"
                  stroke="url(#financialStroke)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  points={financialPoints}
                  className="transition-all duration-700"
                  strokeDasharray="1000"
                  strokeDashoffset={isHovered ? "0" : "15"}
                  style={{ transition: "stroke-dashoffset 2s ease" }}
                />
              </>
            )}

            {/* ESG Carbon Sequestration Line Graph */}
            {(activeTab === "both" || activeTab === "esg") && (
              <>
                <polyline
                  fill="url(#esgGrad)"
                  stroke="none"
                  points={`${padding},${svgHeight - padding} ${esgPoints} ${svgWidth - padding},${svgHeight - padding}`}
                  className="transition-all duration-700"
                />
                <polyline
                  fill="none"
                  stroke="url(#esgStroke)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  points={esgPoints}
                  className="transition-all duration-700"
                  strokeDasharray="1000"
                  strokeDashoffset={isHovered ? "0" : "25"}
                  style={{ transition: "stroke-dashoffset 2.5s ease" }}
                />
              </>
            )}

            {/* Data point circle highlights shown on hover */}
            {GROWTH_DATA.map((d: SimulatorTrendPoint, i: number) => {
              const step = (svgWidth - padding * 2) / (GROWTH_DATA.length - 1);
              const x = padding + i * step;

              const valFin = d.financial;
              const yFin = svgHeight - padding - ((valFin - minVal) / (maxVal - minVal)) * (svgHeight - padding * 2);

              const valEsg = d.esg;
              const yEsg = svgHeight - padding - ((valEsg - minVal) / (maxVal - minVal)) * (svgHeight - padding * 2);

              return (
                <g key={i} className="opacity-70 xl:opacity-0 hover:opacity-100 transition-opacity duration-300">
                  {/* Financial Node */}
                  {(activeTab === "both" || activeTab === "financial") && (
                    <circle
                      cx={x}
                      cy={yFin}
                      r={isHovered ? "5" : "3"}
                      className="fill-amber-400 stroke-zinc-950 stroke-2 cursor-pointer transition-all duration-300"
                    >
                      <title>{`${d.label}: Revenue ${valFin} Mn`}</title>
                    </circle>
                  )}

                  {/* ESG Node */}
                  {(activeTab === "both" || activeTab === "esg") && (
                    <circle
                      cx={x}
                      cy={yEsg}
                      r={isHovered ? "5" : "3"}
                      className="fill-emerald-400 stroke-zinc-950 stroke-2 cursor-pointer transition-all duration-300"
                    >
                      <title>{`${d.label}: Gross Profit ${valEsg} Mn`}</title>
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Value popouts overlaying on top */}
          <div className="absolute top-2 left-4 flex gap-4 text-[10px] font-mono p-1.5 rounded-lg bg-zinc-950/60 border border-white/5 backdrop-blur-md">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Revenue (Mn)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Gross Profit (Mn)
            </span>
          </div>
        </div>

        {/* X Axis Coordinates Labels footer */}
        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 border-b border-white/5 pb-4 mt-2">
          {GROWTH_DATA.map((d: SimulatorTrendPoint, index: number) => (
            <span key={index} className="px-1">{d.label}</span>
          ))}
        </div>

        {/* Interactive Floating Micro Glass Panels */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div 
            className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between transition-transform duration-300 text-left"
            style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)" }}
          >
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-400" />
              Revenue FY 25/26
            </span>
            <span className="text-sm font-bold text-zinc-200 mt-1 block">
              {latestRevenue.value} Mn · {latestRevenue.changePercentage}
            </span>
          </div>

          <div 
            className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between transition-transform duration-300 text-left"
            style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)" }}
          >
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" />
              Gross Profit
            </span>
            <span className="text-sm font-bold text-zinc-200 mt-1 block">
              {latestGross.value} Mn · {latestGross.changePercentage}
            </span>
          </div>

          <div 
            className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between transition-transform duration-300 text-left"
            style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)" }}
          >
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" />
              EPS
            </span>
            <span className="text-sm font-bold text-zinc-200 mt-1 block">
              {latestEps.value} Cts. · {latestEps.changePercentage}
            </span>
          </div>

          <div 
            className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col justify-between transition-transform duration-300 text-left"
            style={{ transform: isHovered ? "translateZ(15px)" : "translateZ(0)" }}
          >
            <span className="text-[8.5px] font-mono text-zinc-500 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              ROE
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-1 block">
              {latestRoe != null ? `${latestRoe}%` : "13.7%"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
