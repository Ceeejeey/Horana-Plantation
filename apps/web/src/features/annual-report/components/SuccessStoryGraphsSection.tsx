import { ReportSectionShell } from "./ReportSectionShell";
import { TenYearSummaryDashboard } from "./TenYearSummaryDashboard";
import { REPORT_CHAPTER_TAGS } from "../reportNavigation";

export function SuccessStoryGraphsSection() {
  return (
    <ReportSectionShell
      id="success-story"
      chapter={REPORT_CHAPTER_TAGS.successStory}
      title="Graphical Representation of Our Success Story"
      subtitle="Fifteen-year financial trajectory across operating results, balance sheet strength, cash flows and key performance indicators."
      align="center"
      contentClassName="max-w-6xl"
    >
      <TenYearSummaryDashboard
        variant="full"
        defaultCategory="operating"
        defaultMetricId="revenue"
        className="w-full"
      />
    </ReportSectionShell>
  );
}
