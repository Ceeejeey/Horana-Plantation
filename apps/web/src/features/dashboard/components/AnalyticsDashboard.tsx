import React, { useState } from "react";
import { 
  BarChart3, Users2, Shield, Calendar, CloudSun, Leaf, Zap, 
  Coins, Cpu, Play, CheckCircle2, RefreshCw, Layers, GraduationCap,
  Sparkles, Sliders, Eye, TrendingUp, Compass, AlertCircle
} from "lucide-react";
import { Card } from "../../../components/common/Card";
import { Button } from "../../../components/common/Button";
import { DemoCarousel } from "./DemoCarousel";
import { GlassTiltCard } from "./GlassTiltCard";
import { SimulatorReportPanels } from "./SimulatorReportPanels";
import { FINANCIAL_HIGHLIGHTS, ESG_HIGHLIGHTS } from "../../annual-report/reportMockData";
import { latestMetricMn } from "../simulatorChartData";

// Mock Horana estates of historical tea/rubber distinction
interface Estate {
  name: string;
  location: string;
  elevation: string;
  crops: string[];
  yieldKg: number;
  workers: number;
  energyGrid: string;
  soilHealth: number; // %
}

const HISTORIC_ESTATES: Estate[] = [
  {
    name: "Fairlawn Estate",
    location: "Up-country (Maskeliya)",
    elevation: "1,400 M",
    crops: ["Ceyon Tea", "Eucalyptus Carbon Wood"],
    yieldKg: 42500,
    workers: 320,
    energyGrid: "100% Micro-Hydro",
    soilHealth: 88,
  },
  {
    name: "Alton Estate",
    location: "Up-country (Upcot)",
    elevation: "1,450 M",
    crops: ["Premium Pekoe Tea"],
    yieldKg: 38200,
    workers: 290,
    energyGrid: "90% Solar Hybrid",
    soilHealth: 91,
  },
  {
    name: "Stockholm Estate",
    location: "Up-country (Nuwara Eliya)",
    elevation: "1,480 M",
    crops: ["Silver Tips Tea", "Artisanal Pekoe"],
    yieldKg: 28900,
    workers: 240,
    energyGrid: "100% Solar Arrays",
    soilHealth: 94,
  },
  {
    name: "Gouravilla Estate",
    location: "Mid-country (Upcot)",
    elevation: "1,120 M",
    crops: ["CTC Tea", "Rubber Wood"],
    yieldKg: 51200,
    workers: 410,
    energyGrid: "60% Biomass Cogeneration",
    soilHealth: 85,
  }
];

export function AnalyticsDashboard() {
  const [selectedEstate, setSelectedEstate] = useState<Estate>(HISTORIC_ESTATES[0]);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    `Audited revenue FY 25/26: ${FINANCIAL_HIGHLIGHTS[0].value} Mn (${FINANCIAL_HIGHLIGHTS[0].changePercentage}).`,
    `Gross profit: ${ESG_HIGHLIGHTS[0].value} Mn · EPS: ${ESG_HIGHLIGHTS[2].value} Cts.`,
    `Ten Year Summary loaded — ${latestMetricMn("revenue") ?? "3,950"} Mn revenue series active.`,
  ]);

  // Capitals slider state for interactive re-balancing sandbox
  const [capitalsState, setCapitalsState] = useState({
    financial: 85,
    manufactured: 78,
    intellectual: 92,
    human: 89,
    social: 84,
    natural: 95
  });

  const handleSliderChange = (capitalKey: keyof typeof capitalsState, val: number) => {
    setCapitalsState(prev => ({
      ...prev,
      [capitalKey]: val
    }));
  };

  // Calculate alignment quotient based on standard offsets from optimum rebalance
  const financialCoeff = capitalsState.financial / 100;
  const naturalCoeff = capitalsState.natural / 100;
  const humanCoeff = capitalsState.human / 100;
  const intellectCoeff = capitalsState.intellectual / 100;
  const socialCoeff = capitalsState.social / 100;
  const manufacturedCoeff = capitalsState.manufactured / 100;

  const totalSum = (financialCoeff + naturalCoeff + humanCoeff + intellectCoeff + socialCoeff + manufacturedCoeff);
  const avgFactor = totalSum / 6;

  // Let's create an Alignment Quality Index percentage
  // If values are perfectly equal (rebalanced), alignment is higher
  const devSum = Math.abs(financialCoeff - avgFactor) + 
                 Math.abs(naturalCoeff - avgFactor) + 
                 Math.abs(humanCoeff - avgFactor) + 
                 Math.abs(intellectCoeff - avgFactor) + 
                 Math.abs(socialCoeff - avgFactor) + 
                 Math.abs(manufacturedCoeff - avgFactor);
  // Max deviation can be around 3.0. We want a penalizing factor
  const alignmentScore = Math.max(0, Math.min(100, Math.round((avgFactor * 100) - (devSum * 15))));

  const triggerForecastSimulation = () => {
    if (simulationRunning) return;
    setSimulationRunning(true);
    
    // Add realistic programmatic simulation logs
    const newLogLines = [
      `Loading audited report streams for ${selectedEstate.name}...`,
      `Financial: Revenue ${FINANCIAL_HIGHLIGHTS[0].value} Mn (${FINANCIAL_HIGHLIGHTS[0].changePercentage}).`,
      `Success Story: PAT ${latestMetricMn("profit-for-year") ?? ESG_HIGHLIGHTS[1].value} Mn from Ten Year Summary.`,
      `ESG: Gross profit ${ESG_HIGHLIGHTS[0].value} Mn · NAV/share ${ESG_HIGHLIGHTS[3].value} Cts.`,
      `Capitals alignment at ${alignmentScore}% — yield forecast ${Math.round(selectedEstate.yieldKg * (avgFactor + 0.05))} kg.`,
    ];

    let timer = 0;
    newLogLines.forEach((line, index) => {
      setTimeout(() => {
        setSimulationLogs(prev => [line, ...prev].slice(0, 15));
        if (index === newLogLines.length - 1) {
          setSimulationRunning(false);
        }
      }, timer + 800);
      timer += 800;
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-zinc-300">
      
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C5A059]/20 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B2118]/60 border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-mono tracking-widest uppercase mb-3">
            <Cpu className="w-3.5 h-3.5 text-[#C5A059]" />
            Enterprise Sandbox · Audited Report Data
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight italic">
            Corporate System <span className="text-[#C5A059] font-serif not-italic font-bold">Simulator</span>
          </h2>
          <p className="mt-2 text-zinc-400 font-sans text-xs sm:text-sm max-w-2xl">
            Live audited report data from Financial Performance, Success Story graphs and ESG indicators — plus estate modelling and capitals sandbox.
          </p>
        </div>

        {/* System Coaction Badge status */}
        <div className="flex items-center gap-4 bg-[#0B2118]/60 p-4 rounded-xl border border-[#C5A059]/30">
          <div className="relative flex items-center justify-center shrink-0">
            <div className={`absolute w-12 h-12 rounded-full border border-dashed animate-spin ${
              alignmentScore > 80 ? "border-[#C5A059]" : "border-[#C5A059]/50"
            }`} style={{ animationDuration: "12s" }}></div>
            <span className={`text-base font-mono font-bold ${
              alignmentScore > 80 ? "text-[#C5A059]" : "text-[#C5A059]/80"
            }`}>
              {alignmentScore}%
            </span>
          </div>
          <div>
            <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059] leading-none">
              Alignment Score
            </h4>
            <p className="text-xs font-sans font-bold text-zinc-200 mt-1 leading-none">
              {alignmentScore > 85 ? "Optimal Balance" : alignmentScore > 70 ? "Moderate Stability" : "Critical Divergence"}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1 leading-none">
              Matrix: ISO/R-Alliance Platinum
            </p>
          </div>
        </div>
      </div>

      <SimulatorReportPanels />

      <div className="mb-8 flex items-center gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C5A059]/30" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500">
          Operational Sandbox · Estate Modelling
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C5A059]/30" />
      </div>

      {/* 3D Perspective Capitals Carousel */}
      <div className="mt-6 mb-12">
        <DemoCarousel />
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

        {/* COLUMN 1: ESTATE SELECTOR & METRICS */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          
          {/* Estate selection cards */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono tracking-widest text-[#D3A243] font-bold uppercase mb-1">
              Estate Audit Registry
            </h3>
            
            {HISTORIC_ESTATES.map((est) => {
              const isSelected = est.name === selectedEstate.name;
              return (
                <button
                  key={est.name}
                  onClick={() => setSelectedEstate(est)}
                  className={`w-full text-left p-4 rounded-xl transition-all border flex flex-col justify-between cursor-pointer ${
                    isSelected 
                      ? "bg-emerald-950/25 border-emerald-500/35 shadow-[0_4px_20px_rgba(16,185,129,0.05)]" 
                      : "bg-zinc-950/30 border-zinc-900/50 hover:border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      isSelected ? "bg-emerald-900/60 text-emerald-400" : "bg-zinc-900 text-zinc-500"
                    }`}>
                      {est.elevation}
                    </span>
                    <span className="text-[10px] font-sans text-zinc-500">{est.location}</span>
                  </div>

                  <h4 className="text-sm font-display font-bold text-white mt-2">
                    {est.name}
                  </h4>

                  <div className="flex items-center justify-between w-full mt-3 border-t border-zinc-900/60 pt-2 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Leaf className="w-3 h-3 text-emerald-500" />
                      Yld: {(est.yieldKg / 1000).toFixed(1)} MT
                    </span>
                    <span className="flex items-center gap-1">
                      <Users2 className="w-3 h-3 text-emerald-500" />
                      Staff: {est.workers}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Biometric Integration stream detail */}
          <Card className="p-5">
            <h3 className="text-xs font-mono tracking-widest text-[#D3A243] font-bold uppercase mb-3 flex items-center justify-between">
              <span>Biometric Sync Gateways</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8.5px] lowercase animate-pulse">
                live feeds
              </span>
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900 text-[11px]">
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-zinc-200">Terminal HP-01 (Fairlawn Central)</span>
                  <span className="text-[9px] text-zinc-500 mt-1">Biometric Attendance Log</span>
                </div>
                <span className="text-emerald-400 font-mono">100% OK</span>
              </div>

              <div className="flex items-center justify-between bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900 text-[11px]">
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-zinc-200">Scale Terminal S-04 (Alton West)</span>
                  <span className="text-[9px] text-zinc-500 mt-1">Direct Smart Scale kg Sync</span>
                </div>
                <span className="text-emerald-400 font-mono">ONLINE</span>
              </div>

              <div className="flex items-center justify-between bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-900 text-[11px]">
                <div className="flex flex-col leading-none">
                  <span className="font-bold text-zinc-200">RFID Sprayer Nodes</span>
                  <span className="text-[9px] text-zinc-500 mt-1">Worker Safety Gateways</span>
                </div>
                <span className="text-amber-400 font-mono">CALIB_02</span>
              </div>
            </div>
            
            <p className="text-[10px] text-zinc-500 mt-3 font-sans leading-relaxed">
              *All biometric integrations securely comply with WHO health guidelines and ILO workplace dignity charters.
            </p>
          </Card>

        </div>

        {/* COLUMN 2: CAPITALS SANDBOX ROTATION */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          
          {/* Advanced 3D Mouse Tilt glass spline growth card */}
          <GlassTiltCard />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Interactive sliders for rebalancing */}
            <Card className="p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-mono tracking-widest text-[#D3A243] font-bold uppercase mb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Systems Tuning Board
                </h3>
                <p className="text-[10.5px] text-zinc-500 font-sans mb-4 leading-normal">
                  Adjust individual capitals to observe forecasting yield impacts.
                </p>

                <div className="flex flex-col gap-3">
                  {[
                    { key: "financial" as const, label: "01. Financial", icon: Coins, color: "text-amber-400" },
                    { key: "manufactured" as const, label: "02. Manufactured", icon: Cpu, color: "text-teal-400" },
                    { key: "intellectual" as const, label: "03. Intellectual", icon: GraduationCap, color: "text-cyan-400" },
                    { key: "human" as const, label: "04. Human", icon: Users2, color: "text-[#D3A243]" },
                    { key: "social" as const, label: "05. Social & Relationship", icon: Compass, color: "text-sky-400" },
                    { key: "natural" as const, label: "06. Natural Base", icon: Leaf, color: "text-emerald-400" },
                  ].map((slider) => {
                    const Icon = slider.icon;
                    return (
                      <div key={slider.key} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-mono flex items-center gap-1.5 ${slider.color}`}>
                            <Icon className="w-3 h-3 shrink-0" />
                            {slider.label}
                          </span>
                          <span className="font-mono text-zinc-400">{capitalsState[slider.key]}%</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="100"
                          value={capitalsState[slider.key]}
                          onChange={(e) => handleSliderChange(slider.key, parseInt(e.target.value))}
                          className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#D3A243]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-zinc-900 mt-5 pt-3 flex flex-col gap-2">
                <p className="text-[9px] text-zinc-500 font-mono italic">
                  *Higher Natural and Human ratios prevent soil erosion and worker attrition.
                </p>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setCapitalsState({ financial: 90, manufactured: 90, intellectual: 90, human: 90, social: 90, natural: 90 })}
                    className="text-[9.5px] font-mono tracking-wider uppercase text-[#D3A243] hover:text-[#D3A243]/80"
                  >
                    Reset to Perfect State
                  </button>
                </div>
              </div>
            </Card>

            {/* Estate Operational Analysis Summary */}
            <div className="flex flex-col gap-6">
              
              <Card className="p-5 bg-zinc-950/70 border border-emerald-500/10">
                <h3 className="text-xs font-mono tracking-widest text-[#D3A243] font-bold uppercase mb-3">
                  Estate Diagnostics: {selectedEstate.name}
                </h3>
                
                <div className="grid grid-cols-2 gap-3.5 pt-1.5">
                  <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 block leading-none">Soil Organic Composition</span>
                    <span className="text-base font-display font-medium text-emerald-400 block mt-1.5 leading-none">
                      {Math.round(selectedEstate.soilHealth * (naturalCoeff * 1.05))}%
                    </span>
                    <span className="text-[9px] text-zinc-600 mt-1 block">R-Alliance standard {selectedEstate.soilHealth}%</span>
                  </div>

                  <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 block leading-none">Labor Retention Rate</span>
                    <span className="text-base font-display font-medium text-emerald-400 block mt-1.5 leading-none">
                      {Math.round(98.4 * (humanCoeff * 1.01))}%
                    </span>
                    <span className="text-[9px] text-zinc-600 mt-1 block">ILO baseline: 92%</span>
                  </div>

                  <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 block leading-none text-wrap">Projected Yield Shift</span>
                    <span className={`text-base font-display font-medium block mt-1.5 leading-none ${
                        avgFactor >= 0.95 ? "text-emerald-400" : "text-amber-500"
                    }`}>
                      {avgFactor >= 1.05 ? "+" : ""}{Math.round((avgFactor - 1) * 100)}%
                    </span>
                    <span className="text-[9px] text-zinc-600 mt-1 block">Projected for: 2026/27</span>
                  </div>

                  <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-900">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 block leading-none">Renewable Grid Split</span>
                    <span className="text-base font-display font-medium text-[#D3A243] block mt-1.5 leading-none">
                      {selectedEstate.energyGrid.split(" ")[0]}
                    </span>
                    <span className="text-[9px] text-indigo-400 mt-1 block truncate">Source: {selectedEstate.energyGrid.split(" ").slice(1).join(" ")}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-900">
                  <Button 
                    onClick={triggerForecastSimulation}
                    disabled={simulationRunning}
                    variant="primary" 
                    size="sm" 
                    className="w-full justify-center flex items-center gap-1.5 cursor-pointer select-none"
                  >
                    {simulationRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Running Projections...
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Trigger Forecast Simulation
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Training LMS Panel */}
              <Card className="p-4 bg-zinc-950/20">
                <h4 className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 mb-2.5 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-500" />
                  Staff Capacity Training (LMS)
                </h4>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs p-2 bg-zinc-900/40 rounded border border-zinc-900/50">
                    <span className="font-sans text-zinc-300 truncate max-w-[180px]">Regenerative compost deployment</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-1 py-0.2 rounded font-bold">88 Completed</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-2 bg-zinc-900/40 rounded border border-zinc-900/50">
                    <span className="font-sans text-zinc-300 truncate max-w-[180px]">Sprayer hazard safety protocol</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-1 py-0.2 rounded font-bold">142 Completed</span>
                  </div>
                </div>
              </Card>

            </div>

          </div>

          {/* Forecast Engine terminal outputs logs console */}
          <Card className="p-4 bg-zinc-950/70 border border-zinc-900">
            <h3 className="text-xs font-mono tracking-widest text-zinc-500 uppercase mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Simulation Live Telemetry Output logs
            </h3>
            
            <div className="w-full bg-zinc-900/30 font-mono text-[10.5px] p-3 rounded-lg border border-zinc-900/60 max-h-[140px] overflow-y-auto flex flex-col gap-1.5 h-32 select-text selection:bg-emerald-500/25">
              {simulationLogs.map((log, i) => (
                <div key={i} className="flex items-start gap-1.5 text-zinc-400 leading-normal border-b border-zinc-950/20 pb-1">
                  <span className="text-[#D3A243] shrink-0 font-bold">&gt;</span>
                  <p>{log}</p>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
}
