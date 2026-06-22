import { ReportSectionShell } from "./ReportSectionShell";
import { BusinessModelDiagram } from "./BusinessModelDiagram";
import { REPORT_CHAPTER_TAGS } from "../reportNavigation";

export function ValueGenerationSection() {
  return (
    <ReportSectionShell
      id="value-generation"
      chapter={REPORT_CHAPTER_TAGS.valueGeneration}
      title="Value Generation Process"
      subtitle="Our integrated business model — from estate activities and operations through to governance-led value creation."
      align="center"
      layout="flow"
      contentClassName="max-w-3xl"
      showYearBadge={false}
    >
      <BusinessModelDiagram />

      <p className="mt-8 max-w-xl text-center font-mono text-[9px] uppercase leading-relaxed tracking-wider text-zinc-600">
        Outer rings rotate in alternating directions · Central governance cube remains fixed
      </p>
    </ReportSectionShell>
  );
}
