import React, { useState, useEffect } from "react";
import { Cpu, CheckCircle2, RotateCw } from "lucide-react";

interface ReasoningLoaderProps {
  userQuery?: string;
  onTimelineComplete?: () => void;
}

export const ReasoningLoader = ({ userQuery = "" }: ReasoningLoaderProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Clean, descriptive corporate stages
  const normalizedQuery = userQuery.toLowerCase();
  const requiresVisuals = /graph|chart|plot|ප්‍රස්ථාර|ග්‍රාෆ්|චාට්|වගුව|table|compare|සංසන්දනය/.test(normalizedQuery);

  const steps = [
    {
      id: "THINKING",
      label: "COGNITIVE THINKING",
      subText: "Analyzing constraints & alignment against 17 UN SDGs and 6 Capitals Framework",
      actionWord: "Thinking..."
    },
    {
      id: "RETRIEVAL",
      label: "DATA ACQUISITION",
      subText: "Retrieving audit logs, estate summaries, and certified plantation records",
      actionWord: "Sourcing..."
    },
    {
      id: "DRAWING",
      label: requiresVisuals ? "VECTOR GRAPH DRAWING" : "MARKDOWN COMPILING",
      subText: requiresVisuals 
        ? "Drawing dynamic charts using Recharts responsive coordinate matrices"
        : "Formulating styled executive tables & narrative grids",
      actionWord: requiresVisuals ? "Drawing..." : "Formatting..."
    },
    {
      id: "FINALIZE",
      label: "REPORT COMMISSIONING",
      subText: "Polishing typographic hierarchy and final security checks for transmission",
      actionWord: "Delivering..."
    }
  ];

  useEffect(() => {
    // Total execution simulation split sequentially - adaptive speed for instant feel
    const intervals = requiresVisuals 
      ? [250, 250, 300, 200]  // Quick elegant visual building (1s total)
      : [80, 80, 80, 60];     // Ultra-fast instant compile for general texts (0.3s total)
    let currentIndex = 0;

    const runNextStep = () => {
      if (currentIndex < steps.length - 1) {
        const timer = setTimeout(() => {
          currentIndex++;
          setCurrentStepIndex(currentIndex);
          runNextStep();
        }, intervals[currentIndex]);
        return timer;
      }
    };

    const globalTimer = runNextStep();

    return () => {
      if (globalTimer) clearTimeout(globalTimer);
    };
  }, [requiresVisuals]);

  return (
    <div className="flex gap-2 sm:gap-3 max-w-[96%] sm:max-w-[85%] mr-auto text-xs font-mono">
      {/* Dynamic Animated Core Icon */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
        <Cpu className="w-4 h-4 animate-spin text-[#C5A059]" style={{ animationDuration: "3s" }} />
      </div>
      
      {/* Step Progress Display Card */}
      <div className="flex-grow bg-[#050f0a] border border-[#C5A059]/25 rounded-2xl rounded-tl-none p-3.5 sm:p-4 text-zinc-300 shadow-[0_12px_35px_rgba(0,0,0,0.6)]">
        {/* Loader Header */}
        <div className="flex items-center justify-between border-b border-[#C5A059]/15 pb-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-ping" />
            <span className="text-[8px] font-extrabold text-[#C5A059] tracking-widest uppercase">
              EXECUTIVE ANALYST COGNITIVE FLOW
            </span>
          </div>
          <span className="text-[7.5px] text-[#C5A059] bg-[#C5A059]/10 px-1.5 py-0.5 rounded border border-[#C5A059]/10 font-bold uppercase shrink-0">
            {steps[currentStepIndex].actionWord}
          </span>
        </div>

        {/* Sequential Step Progress Blocks */}
        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div 
                key={step.id} 
                className={`flex gap-3 items-start transition-all duration-300 ${
                  isActive ? "opacity-100 scale-[1.01]" : "opacity-45 scale-100"
                }`}
              >
                {/* Step Icon Status Marker */}
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 font-bold" />
                  ) : isActive ? (
                    <RotateCw className="w-3.5 h-3.5 text-[#C5A059] animate-spin" style={{ animationDuration: "2s" }} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 bg-zinc-900/60" />
                  )}
                </div>

                {/* Step Metadata text */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-semibold tracking-wider ${
                      isActive ? "text-white" : isCompleted ? "text-emerald-400" : "text-zinc-500"
                    }`}>
                      {step.label}
                    </span>
                    {isActive && (
                      <span className="text-[7px] text-zinc-500 uppercase animate-pulse">Running</span>
                    )}
                  </div>
                  {isActive && (
                    <p className="text-[8.5px] text-zinc-400 mt-0.5 leading-snug font-sans italic">
                      {step.subText}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic visual progress metrics */}
        <div className="flex items-center gap-1.5 border-t border-white/5 pt-3 mt-3">
          <span className="text-[7.5px] text-zinc-500 uppercase tracking-widest mr-1 font-bold">TIMELINES:</span>
          {steps.map((st, idx) => {
            const isDone = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            return (
              <div 
                key={st.id} 
                className={`flex-grow h-1.5 rounded-full transition-all duration-300 ${
                  isDone 
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                    : isActive 
                      ? "bg-[#C5A059] animate-pulse" 
                      : "bg-white/5"
                }`}
                title={st.label}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
