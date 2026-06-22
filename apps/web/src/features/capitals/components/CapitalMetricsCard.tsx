import React, { useState, useRef } from "react";
import { 
  TrendingUp, Leaf, BarChart3, HelpCircle, ArrowUpRight, Zap, 
  Coins, Sparkles, AlertCircle, Info, ShieldCheck, Milestone,
  Cpu, Award, Heart, Eye, Users2, Database, Network, Activity
} from "lucide-react";

interface CapitalMetricsCardProps {
  capitalId: string;
}

export function CapitalMetricsCard({ capitalId }: CapitalMetricsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt and light position coordinates
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  // Compute 3D Tilt rotation coordinates on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const degX = (mouseY / (height / 2)) * -12; // Max 12 deg tilt
    const degY = (mouseX / (width / 2)) * 12;

    setRotateX(degX);
    setRotateY(degY);

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
    setShinePos({ x: 50, y: 50 });
  };

  // Render appropriate indicators based on capitalId
  const renderCapitalMetrics = () => {
    switch (capitalId) {
      case "financial":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
              <span className="text-zinc-500">Metric Stream</span>
              <span className="text-[#C5A059] font-bold">SYS.FIN.08X</span>
            </div>
            
            {/* Custom SVG Mini Bar Chart */}
            <div className="h-20 w-full flex items-end gap-1.5 justify-between py-2 border-b border-white/5">
              {[45, 60, 52, 78, 85, 96, 110, 132].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full rounded-t bg-gradient-to-t from-amber-600 to-amber-400 transition-all duration-500 ease-out" 
                    style={{ height: `${(val / 140) * 100}%` }}
                  />
                  <span className="text-[7px] font-mono mt-1 text-zinc-600">Q{1 + (idx % 4)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">FOB Premium</span>
                <span className="text-sm font-bold text-white mt-1 block">+14.2%</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Est. Portfolio</span>
                <span className="text-sm font-bold text-zinc-200 mt-1 block">Rs. 840M</span>
              </div>
            </div>
          </div>
        );

      case "manufactured":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
              <span className="text-zinc-500">Smart Grid Share</span>
              <span className="text-teal-400 font-bold">82% RENEWABLE</span>
            </div>

            {/* Live Progress Ring Indicator using SVG */}
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="26" className="stroke-white/5" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="32" cy="32" r="26" 
                    className="stroke-teal-400 transition-all duration-700" 
                    strokeWidth="4" fill="transparent"
                    strokeDasharray="163.3"
                    strokeDashoffset={163.3 - (163.3 * 82) / 100}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[11px] font-mono text-white font-bold">
                  82%
                </div>
              </div>

              <div className="flex flex-col gap-1 text-[10px] font-mono text-zinc-400 text-right">
                <span>⚡ Solar Power Arrays: 1.2 MW</span>
                <span>🔥 Biomass Boilers: 85% Eff</span>
                <span>📦 RFID Logistics: Online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Modernized Dryers</span>
                <span className="text-xs font-bold text-white mt-1 block">18 Units Sync</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Heavy Scales RT</span>
                <span className="text-xs font-bold text-teal-400 mt-1 block">99.8% Accuracy</span>
              </div>
            </div>
          </div>
        );

      case "intellectual":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
              <span className="text-zinc-500">NPK Agronomic Levels</span>
              <span className="text-cyan-400 font-bold">OPTIMAL SYNC</span>
            </div>

            {/* Custom Soil NPK Dial System */}
            <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-zinc-400">[N] Nitrogen absorption</span>
                <span className="text-white font-bold">94.2%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "94.2%" }}></div>
              </div>

              <div className="flex justify-between text-[10px] font-mono mt-1">
                <span className="text-zinc-400">[P] Phosphorus balance</span>
                <span className="text-white font-bold">88.5%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: "88.5%" }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1 text-left text-[10px] font-mono">
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] text-zinc-500 block uppercase">Clonal Harvest</span>
                <span className="font-bold text-zinc-200 mt-1 block">TRI-2023 Premium</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] text-zinc-500 block uppercase">Satellite Sync</span>
                <span className="font-bold text-cyan-400 mt-1 block">Telemetry Active</span>
              </div>
            </div>
          </div>
        );

      case "human":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
              <span className="text-zinc-500">Dignified Operations</span>
              <span className="text-indigo-400 font-bold">1270 STAFF</span>
            </div>

            {/* Micro Activity Heartbeat Graph using SVG path */}
            <div className="h-16 w-full relative border-b border-white/5 flex items-center justify-center py-2">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path 
                  d="M0,15 L20,15 L25,5 L30,25 L35,15 L50,15 L55,2 L60,28 L65,15 L100,15" 
                  fill="none" 
                  stroke="#818CF8" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
              <div className="absolute top-1 left-2 text-[8px] font-mono text-zinc-500 uppercase">
                Staff Wellbeing Pulse Track
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">ILO Standard Audit</span>
                <span className="text-[11px] font-bold text-emerald-400 mt-1 block">100% Compliant</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Safety Record</span>
                <span className="text-[11px] font-bold text-white mt-1 block">Zero Incidents YTD</span>
              </div>
            </div>
          </div>
        );

      case "social":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
              <span className="text-zinc-500">Fairtrade Community Hub</span>
              <span className="text-sky-400 font-bold">PLATINUM RANK</span>
            </div>

            <div className="flex items-center gap-3.5 border-b border-white/5 pb-3">
              <div className="w-12 h-12 rounded-full border border-sky-400/20 bg-sky-500/10 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-sky-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-white">Rs. 24M Allocated</span>
                <span className="text-[10px] text-zinc-400 mt-1">Direct Village Co-op and Housing support programs</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Estate Health Camps</span>
                <span className="text-xs font-bold text-white mt-1 block">14 Programs Admin</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Outgrowers Engaged</span>
                <span className="text-xs font-bold text-sky-400 mt-1 block">+18.5% Growth</span>
              </div>
            </div>
          </div>
        );

      case "natural":
        default:
        return (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-[11px] font-mono border-b border-white/5 pb-2">
              <span className="text-zinc-500">Offset Sequestration</span>
              <span className="text-emerald-400 font-bold">28K TONS O2</span>
            </div>

            {/* Custom SVG Soil Hydrology pH Area spline */}
            <div className="h-16 w-full relative border-b border-white/5 flex items-center justify-center py-2">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path 
                  d="M0,28 Q20,10 40,22 T80,5 T100,12" 
                  fill="none" 
                  stroke="#34D399" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute top-1 right-2 text-[8px] font-mono text-zinc-500 uppercase">
                Restored Soil Nutrient index
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="p-2.5 rounded-lg bg-zinc-950/40 border border-white/5">
                <span className="text-[9px] font-mono text-zinc-500 block uppercase">Rainforest Preserve</span>
                <span className="text-xs font-bold text-white mt-1 block">Alliance Audited</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0E281F]/30 border border-emerald-500/25">
                <span className="text-[9px] font-mono text-emerald-400/80 block uppercase">Soil pH Index</span>
                <span className="text-xs font-bold text-emerald-400 mt-1 block">6.8 pH Level</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full relative gpu-accelerated pointer-events-auto"
      style={{ perspective: "1000px" }}
      id={`3d-capital-metrics-${capitalId}`}
    >
      
      {/* Dynamic colorful blur underlay tied to current hover status */}
      <div 
        className="absolute -inset-1 bg-gradient-to-tr from-emerald-500/5 via-amber-500/5 to-cyan-500/5 rounded-2xl blur-xl -z-10 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0.4 }}
      ></div>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-sm mx-auto rounded-2xl p-5 relative overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] select-none border border-white/10"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${isHovered ? "24px" : "0px"})`,
          transformStyle: "preserve-3d",
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(30px) saturate(130%)",
          boxShadow: isHovered
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)"
            : "0 10px 25px -8px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        }}
      >
        {/* Shine Overlay light beam */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-color-dodge transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 180px at ${shinePos.x}% ${shinePos.y}%, rgba(255, 255, 255, 0.25) 0%, transparent 80%)`,
          }}
        ></div>

        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-[#C5A059]" />
          <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-widest font-bold">
            Live Telemetry Indexer
          </span>
        </div>

        {/* Content of indicators */}
        {renderCapitalMetrics()}

        {/* Aesthetic hardware tag */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[7px] font-mono text-zinc-600 uppercase">
          <span>Sys Active // Node: Sri Lanka</span>
          <span>99.9% Telemetry sync rate</span>
        </div>

      </div>
    </div>
  );
}
