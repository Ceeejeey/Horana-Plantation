import React from "react";
import { FirstPageSection } from "./components/FirstPageSection";
import { ValueGenerationSection } from "./components/ValueGenerationSection";
import { LeadershipSection } from "./components/LeadershipSection";
import { FinancialPerformanceSection } from "./components/FinancialPerformanceSection";
import { SuccessStoryGraphsSection } from "./components/SuccessStoryGraphsSection";
import { EsgPerformanceSection } from "./components/EsgPerformanceSection";
import { CapitalsSplitView } from "../capitals/layouts/CapitalsSplitView";

export function AnnualReportView() {
  return (
    <div className="w-full">
      <FirstPageSection />
      <ValueGenerationSection />

      <div id="six-capitals" className="scroll-mt-24">
        <CapitalsSplitView
          variant="chapter"
          chapterIntro={{
            chapter: "04 / Six Capitals",
            title: "Six Capitals of Report Content",
            subtitle:
              "Scroll through each capital — the cube gallery shifts horizontally as you read.",
          }}
        />
      </div>

      <LeadershipSection />
      <FinancialPerformanceSection />
      <SuccessStoryGraphsSection />
      <EsgPerformanceSection />
    </div>
  );
}
