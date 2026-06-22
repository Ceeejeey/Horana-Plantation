import React from "react";
import { Check } from "lucide-react";
import { useActiveSection } from "../../../context/ActiveSectionContext";
import {
  REPORT_SECTIONS,
  scrollToReportSection,
} from "../../annual-report/reportNavigation";

export function CapitalsProgress() {
  const { activeReportChapter } = useActiveSection();

  return (
    <div className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 select-none bg-[#0B2118]/60 p-3 rounded-2xl border border-[#C5A059]/20 backdrop-blur-md max-h-[80vh] overflow-y-auto">
      {REPORT_SECTIONS.map((section, idx) => {
        const isCurrent = activeReportChapter === idx;
        const isCompleted = activeReportChapter > idx;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToReportSection(idx)}
            className="group flex items-center justify-end gap-2 text-right text-xs focus:outline-none cursor-pointer"
            title={section.label}
          >
            <span
              className={`text-[8px] font-mono tracking-widest uppercase transition-all duration-300 max-w-[88px] leading-tight ${
                isCurrent
                  ? "text-[#C5A059] opacity-100 font-bold"
                  : "text-zinc-400 hover:text-[#C5A059] opacity-0 group-hover:opacity-100"
              }`}
            >
              {section.navLabel}
            </span>

            <div
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 ${
                isCurrent
                  ? "border-[#C5A059] bg-[#C5A059]/20 scale-125"
                  : isCompleted
                  ? "border-[#C5A059]/55 bg-[#C5A059]/10"
                  : "border-zinc-800 bg-[#0B2118]/40 hover:border-[#C5A059]/40"
              }`}
            >
              {isCompleted ? (
                <Check className="w-2 h-2 text-[#C5A059] stroke-[3]" />
              ) : (
                <div
                  className={`w-1 h-1 rounded-full transition-all ${
                    isCurrent ? "bg-[#C5A059] animate-pulse" : "bg-zinc-700"
                  }`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
