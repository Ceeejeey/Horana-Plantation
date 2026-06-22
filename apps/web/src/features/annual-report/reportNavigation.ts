export interface ReportSection {
  id: string;
  label: string;
  navLabel: string;
  description: string;
}

export const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "first-page",
    label: "First Page",
    navLabel: "Opening",
    description: "Welcome gateway and official opening spread of the Annual Report 2025/26.",
  },
  {
    id: "value-generation",
    label: "Value Generation Process",
    navLabel: "Value",
    description: "How inputs, activities, outputs and outcomes create stakeholder value.",
  },
  {
    id: "six-capitals",
    label: "Six Capitals of Report Content",
    navLabel: "Six Capitals",
    description: "Interactive journey across the six capitals of integrated reporting.",
  },
  {
    id: "chairman-message",
    label: "Chairman's Message",
    navLabel: "Chairman",
    description: "Leadership perspective on systemic balance and long-term value.",
  },
  {
    id: "md-review",
    label: "Managing Director's Review",
    navLabel: "MD Review",
    description: "Operational review and strategic priorities for the year ahead.",
  },
  {
    id: "financial-performance",
    label: "Financial Performance",
    navLabel: "Financial",
    description: "Audited financial statements and performance highlights.",
  },
  {
    id: "success-story",
    label: "Graphical Representation of Our Success Story",
    navLabel: "Graphs",
    description: "Financial trends and key indicators across the reporting period.",
  },
  {
    id: "esg-performance",
    label: "ESG Performance",
    navLabel: "ESG",
    description: "Environmental, social and governance disclosures and metrics.",
  },
];

export const REPORT_SECTION_IDS = REPORT_SECTIONS.map((s) => s.id);

export function scrollToReportSection(index: number) {
  const section = REPORT_SECTIONS[index];
  if (!section) return;

  const el = document.getElementById(section.id);
  if (!el) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const top = el.getBoundingClientRect().top + scrollTop - 88;
  window.scrollTo({ top, behavior: "smooth" });
}
