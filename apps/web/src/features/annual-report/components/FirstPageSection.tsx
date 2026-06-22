import { ReportHeroShowcase } from "../../../components/common/ReportHeroShowcase";
import { ReportSectionShell } from "./ReportSectionShell";
import { REPORT_CHAPTER_TAGS } from "../reportNavigation";

export function FirstPageSection() {
  return (
    <ReportSectionShell
      id="first-page"
      chapter={REPORT_CHAPTER_TAGS.opening}
      title="Welcome to Our Annual Report"
      subtitle="An immersive gateway into how Horana Plantations creates value across six integrated capitals."
      align="center"
      layout="hero"
      contentClassName="max-w-6xl w-full"
      showYearBadge
    >
      <ReportHeroShowcase variant="released" embedded className="w-full" />
    </ReportSectionShell>
  );
}
