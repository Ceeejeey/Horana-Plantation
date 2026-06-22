import React, { useState } from "react";
import { motion } from "motion/react";
import { ComingSoonPage } from "./components/common/ComingSoonPage";
import { ReleaseLoadingScreen } from "./components/common/ReleaseLoadingScreen";
import { ActiveSectionProvider, useActiveSection } from "./context/ActiveSectionContext";
import { useReleaseStatus } from "./hooks/useReleaseStatus";
import { useScrollSpy } from "./hooks/useScrollSpy";
import { useReportSectionSpy } from "./hooks/useReportSectionSpy";
import { Navbar } from "./components/common/Navbar";
import { AnnualReportView } from "./features/annual-report/AnnualReportView";
import { AnalyticsDashboard } from "./features/dashboard/components/AnalyticsDashboard";
import { ExecutiveAIChat } from "./features/executive-ai";
import { Compass } from "lucide-react";

function MainAppContent() {
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  useScrollSpy(!showDashboard);
  useReportSectionSpy(!showDashboard);
  const { activeReportChapter } = useActiveSection();

  const backgroundClasses = [
    "bg-[#0B2118] text-zinc-100",
    "bg-linear-to-b from-[#0B2118] via-[#102d21] to-[#05110c] text-zinc-100",
    "bg-linear-to-b from-[#05110c] via-[#1c1f1d] to-[#0B2118] text-zinc-100",
    "bg-linear-to-b from-[#0B2118] via-[#0a2732] to-[#05110c] text-zinc-100",
    "bg-linear-to-b from-[#05110c] via-[#071f33] to-[#0B2118] text-zinc-100",
    "bg-linear-to-b from-[#0B2118] via-[#241c0e] to-[#05110c] text-zinc-100",
    "bg-linear-to-b from-[#05110c] via-[#0a3821] to-[#0B2118] text-zinc-100",
    "bg-linear-to-b from-[#0a1e16] via-[#0B2118] to-[#05110c] text-zinc-100",
    "bg-[#0a1e16] text-zinc-100",
  ];

  const currentBgClass = backgroundClasses[activeReportChapter] || "bg-zinc-950";

  return (
    <div
      className={`min-h-screen w-full max-w-[100vw] overflow-x-hidden transition-colors duration-1000 ease-in-out font-sans ${currentBgClass}`}
    >
      {!showDashboard && <Navbar />}

      {showDashboard && (
        <button
          onClick={() => setShowDashboard(false)}
          className="fixed top-6 right-6 z-[250] flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold tracking-wider rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#b08b47] hover:to-[#C5A059] text-black uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(197,160,89,0.3)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.45)] active:scale-95 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Exit Simulation / Back</span>
        </button>
      )}

      {showDashboard ? (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <AnalyticsDashboard />
        </div>
      ) : (
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnnualReportView />

          <footer className="w-full border-t border-[#C5A059]/25 py-12 px-4 sm:px-6 lg:px-8 bg-[#05110c]/90 relative z-30 select-none">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs text-zinc-400 max-w-5xl mx-auto">
              <div>
                <h4 className="font-serif font-bold text-[#C5A059] tracking-wider uppercase">
                  HORANA PLANTATIONS PLC
                </h4>
                <p className="mt-2 leading-relaxed text-zinc-400">
                  A premier agribusiness holding of Sri Lanka. Leading global
                  exports across Pekoe leaf tiers and high-purity natural latex
                  rubber.
                </p>
              </div>
              <div>
                <h4 className="font-mono tracking-widest uppercase text-[#C5A059] font-bold">
                  Agronomic Standards
                </h4>
                <p className="mt-2 leading-relaxed font-mono text-[10px] text-zinc-500">
                  + Rainforest Alliance Certified
                  <br />
                  + ISO 14001:2015 Environmental Systems
                  <br />
                  + Fairtrade Premium Sourced Portfolio
                </p>
              </div>
              <div>
                <h4 className="font-mono tracking-widest uppercase text-[#C5A059] font-bold">
                  Future Ready Core
                </h4>
                <p className="mt-2 leading-relaxed text-zinc-400">
                  All systems operate securely across biometric records,
                  precision telemetry, and smart weighing grids.
                </p>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-zinc-900/40 text-center text-[10px] text-zinc-600">
              &copy; {new Date().getFullYear()} Horana Plantations PLC. All
              rights reserved.
            </div>
          </footer>
        </div>
      )}

      <ExecutiveAIChat />
    </div>
  );
}

export default function App() {
  const { released, loading: releaseLoading } = useReleaseStatus();
  const [introComplete, setIntroComplete] = useState(false);

  if (!introComplete) {
    return (
      <ReleaseLoadingScreen
        releaseReady={!releaseLoading}
        onComplete={() => setIntroComplete(true)}
      />
    );
  }

  if (!released) {
    return (
      <motion.div
        className="min-h-[100dvh] w-full"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <ComingSoonPage />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen w-full"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <ActiveSectionProvider>
        <MainAppContent />
      </ActiveSectionProvider>
    </motion.div>
  );
}
