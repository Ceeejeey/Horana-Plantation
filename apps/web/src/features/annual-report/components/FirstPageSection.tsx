import { ReportHeroShowcase } from "../../../components/common/ReportHeroShowcase";
import { ReportSectionShell } from "./ReportSectionShell";

export function FirstPageSection() {
  return (
    <ReportSectionShell
      id="first-page"
      chapter="02 / First Page"
      align="center"
      layout="hero"
      contentClassName="max-w-6xl w-full"
      showYearBadge={false}
    >
      <ReportHeroShowcase variant="released" embedded className="w-full" />
    </ReportSectionShell>
  );
}
