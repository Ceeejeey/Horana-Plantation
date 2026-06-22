import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useActiveSection } from "../../context/ActiveSectionContext";
import {
  REPORT_SECTIONS,
  scrollToReportSection,
} from "../../features/annual-report/reportNavigation";

export function Navbar() {
  const { activeReportChapter } = useActiveSection();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chapterMenuOpen, setChapterMenuOpen] = useState(false);

  const activeSection = REPORT_SECTIONS[activeReportChapter];

  const handleNavigate = (idx: number) => {
    scrollToReportSection(idx);
    setMobileMenuOpen(false);
    setChapterMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-100 bg-[#0B2118]/85 backdrop-blur-md border-b border-[#C5A059]/25 selection:bg-[#C5A059]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        <div className="flex flex-col select-none shrink-0">
          <span className="text-sm sm:text-base md:text-lg font-serif tracking-widest uppercase border-b border-[#C5A059] pb-0.5 text-white">
            Horana Plantations PLC
          </span>
        </div>

        {/* Chapter navigation — desktop */}
        <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center min-w-0">
          <div className="relative">
            <button
              type="button"
              onClick={() => setChapterMenuOpen((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C5A059]/30 bg-[#05110c]/80 text-[11px] font-mono uppercase tracking-wider text-[#E5C079] hover:bg-[#C5A059]/10 transition-all cursor-pointer"
            >
              <span className="truncate max-w-[180px]">
                {activeSection?.navLabel ?? "Chapters"}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${chapterMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {chapterMenuOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 max-h-[60vh] overflow-y-auto rounded-xl border border-[#C5A059]/25 bg-[#0B2118]/95 backdrop-blur-lg shadow-2xl p-2 z-50">
                {REPORT_SECTIONS.map((section, idx) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => handleNavigate(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      activeReportChapter === idx
                        ? "bg-[#C5A059] text-black font-bold"
                        : "text-zinc-300 hover:bg-[#05110c] hover:text-[#C5A059]"
                    }`}
                  >
                    <span className="text-[#C5A059]/70 mr-2">0{idx + 1}</span>
                    {section.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto max-w-[42vw] no-scrollbar px-1">
            {REPORT_SECTIONS.map((section, idx) => (
              <button
                key={section.id}
                type="button"
                onClick={() => handleNavigate(idx)}
                className={`shrink-0 px-2.5 py-1 text-[10px] font-mono tracking-wider uppercase rounded-full transition-all duration-300 cursor-pointer ${
                  activeReportChapter === idx
                    ? "bg-[#C5A059] text-black font-bold shadow-md"
                    : "text-zinc-500 hover:text-[#C5A059]"
                }`}
              >
                {section.navLabel}
              </button>
            ))}
          </div>
        </nav>

        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-zinc-200 p-2"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#0B2118]/95 border-b border-[#C5A059]/20 p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-top-5 duration-200 backdrop-blur-lg max-h-[75vh] overflow-y-auto">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059] mb-1">
              Report Chapters
            </span>
            <div className="grid grid-cols-1 gap-2">
              {REPORT_SECTIONS.map((section, idx) => (
                <button
                  key={`mob-${section.id}`}
                  onClick={() => handleNavigate(idx)}
                  className={`px-3 py-2.5 text-[10px] font-mono text-left tracking-wider uppercase rounded-md transition-all cursor-pointer ${
                    activeReportChapter === idx
                      ? "bg-[#C5A059] text-black font-bold border border-[#C5A059]/30"
                      : "text-zinc-300 hover:bg-[#05110c]"
                  }`}
                >
                  <span className="text-[#C5A059]/60 mr-2">0{idx + 1}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
