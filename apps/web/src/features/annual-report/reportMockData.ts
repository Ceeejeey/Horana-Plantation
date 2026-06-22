import chairmanPortrait from "../../assets/images/chairman_portrait_1779635619055.png";
import mdPortrait from "../../assets/images/md_portrait_1779635639645.png";
import annualReportPdf from "../../assets/pdf/annual-report/Horana AR 2025-26.pdf";

export const ANNUAL_REPORT_PDF_URL = annualReportPdf;

export const REPORT_META = {
  year: "2025/26",
  title: "Annual Report",
  company: "Horana Plantations PLC",
  tagline: "Every Move Matters",
};

export const VALUE_GENERATION_STEPS = [
  {
    title: "Inputs",
    items: ["Natural resources", "Financial capital", "Human talent", "Intellectual assets"],
  },
  {
    title: "Business Activities",
    items: ["Estate operations", "Processing & logistics", "Innovation programs", "Community partnerships"],
  },
  {
    title: "Outputs",
    items: ["Tea & rubber volumes", "Revenue generation", "Employment", "Training hours"],
  },
  {
    title: "Outcomes",
    items: ["Stakeholder returns", "Environmental stewardship", "Social wellbeing", "Governance strength"],
  },
];

export const CHAIRMAN_MESSAGE = {
  name: "A M PANDITHAGE",
  role: "Chairman — Executive Director",
  credentials: "Horana Plantations PLC",
  capitalFocus: "Integrated Financial & Natural Equilibrium",
  quote:
    "We recognise that long term value creation in plantations depends on the careful alignment of many moving parts; land, labour, capital, climate resilience, market access, community wellbeing and regulatory stability. In many ways, this reflects the logic of a Rubik's Cube, where each move affects the position and balance of the whole.",
  image: chairmanPortrait,
  signature: "A M Pandithage",
  pdfSection: "Chairman's Message",
  audioLabel: "Chairman's Message",
};

export const MD_REVIEW = {
  name: "ROSHAN RAJADURAI",
  role: "Managing Director",
  credentials: "Horana Plantations PLC",
  capitalFocus: "Intellectual, Human & Manufactured Modernization",
  quote:
    "We continued to advance the integrated approach through operational improvements, sustainability led initiatives, digital systems, diversification and people focused programmes. These priorities are aligned with the Hayleys Plantations ESG Framework \"Regenerate\".",
  image: mdPortrait,
  signature: "Roshan Rajadurai",
  pdfSection: "Managing Director's Review",
  audioLabel: "Managing Director's Review",
};

export interface LeaderProfile {
  name: string;
  role: string;
  credentials: string;
  capitalFocus: string;
  quote: string;
  image: string;
  signature: string;
  pdfSection: string;
  audioLabel: string;
}

export interface FinancialHighlight {
  title: string;
  value: string;
  changePercentage: string;
  trend: "up" | "down";
  comparison: string;
}

export const FINANCIAL_HIGHLIGHTS: FinancialHighlight[] = [
  {
    title: "REVENUE (Rs' 000)",
    value: "3,950",
    changePercentage: "+6.8%",
    trend: "up",
    comparison: "vs 2024/25",
  },
  {
    title: "MARKET PRICE PER SHARE (Rs. Cts.)",
    value: "46.9",
    changePercentage: "+5.6%",
    trend: "up",
    comparison: "vs 2024/25",
  },
  {
    title: "SHAREHOLDERS' FUNDS (Rs' 000)",
    value: "1,003",
    changePercentage: "+9.3%",
    trend: "up",
    comparison: "vs 2024/25",
  },
  {
    title: "PRICE-EARNINGS RATIO (Times)",
    value: "8.53",
    changePercentage: "+39%",
    trend: "up",
    comparison: "vs 2024/25",
  },
];

export const ESG_HIGHLIGHTS: FinancialHighlight[] = [
  {
    title: "GROSS PROFIT (Rs' 000)",
    value: "1,245",
    changePercentage: "+8.2%",
    trend: "up",
    comparison: "vs 2024/25",
  },
  {
    title: "NET PROFIT BEFORE TAX (Rs' 000)",
    value: "850",
    changePercentage: "+4.1%",
    trend: "up",
    comparison: "vs 2024/25",
  },
  {
    title: "EARNINGS PER SHARE (Rs. Cts.)",
    value: "5.50",
    changePercentage: "+12.5%",
    trend: "up",
    comparison: "vs 2024/25",
  },
  {
    title: "NET ASSET VALUE PER SHARE (Rs. Cts.)",
    value: "42.15",
    changePercentage: "+7.3%",
    trend: "up",
    comparison: "vs 2024/25",
  },
];
