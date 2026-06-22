import { ReportSectionShell } from "./ReportSectionShell";
import { TenYearSummaryDashboard } from "./TenYearSummaryDashboard";

export function SuccessStoryGraphsSection() {
  return (
    <ReportSectionShell
      id="success-story"
      chapter="08 / Success Story"
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
