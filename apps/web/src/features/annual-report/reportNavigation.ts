export interface ReportSection {
  id: string;
  label: string;
  navLabel: string;
  /** Theme chapter tag — section name only, no numeric prefix. */
  chapterTag: string;
  description: string;
}

/** Shared chapter tags for report sections (no numbering). */
export const REPORT_CHAPTER_TAGS = {
  opening: "Opening",
  valueGeneration: "Value Generation",
  sixCapitals: "Six Capitals",
  leadership: "Leadership",
  financial: "Financial Performance",
  successStory: "Success Story",
  esg: "ESG Performance",
} as const;

export const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "first-page",
    label: "Welcome",
    navLabel: "Opening",
    chapterTag: REPORT_CHAPTER_TAGS.opening,
    description: "Welcome gateway and official opening spread of the Annual Report 2025/26.",
  },
  {
    id: "value-generation",
    label: "Value Generation Process",
    navLabel: "Value",
    chapterTag: REPORT_CHAPTER_TAGS.valueGeneration,
    description: "How inputs, activities, outputs and outcomes create stakeholder value.",
  },
  {
    id: "six-capitals",
    label: "Six Capitals of Report Content",
    navLabel: "Six Capitals",
    chapterTag: REPORT_CHAPTER_TAGS.sixCapitals,
    description: "Interactive journey across the six capitals of integrated reporting.",
  },
  {
    id: "chairman-message",
    label: "Chairman's Message",
    navLabel: "Chairman",
    chapterTag: "Chairman's Message",
    description: "Leadership perspective on systemic balance and long-term value.",
  },
  {
    id: "md-review",
    label: "Managing Director's Review",
    navLabel: "MD Review",
    chapterTag: "MD Review",
    description: "Operational review and strategic priorities for the year ahead.",
  },
  {
    id: "financial-performance",
    label: "Financial Performance",
    navLabel: "Financial",
    chapterTag: REPORT_CHAPTER_TAGS.financial,
    description: "Audited financial statements and performance highlights.",
  },
  {
    id: "success-story",
    label: "Graphical Representation of Our Success Story",
    navLabel: "Graphs",
    chapterTag: REPORT_CHAPTER_TAGS.successStory,
    description: "Financial trends and key indicators across the reporting period.",
  },
  {
    id: "esg-performance",
    label: "ESG Performance",
    navLabel: "ESG",
    chapterTag: REPORT_CHAPTER_TAGS.esg,
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
