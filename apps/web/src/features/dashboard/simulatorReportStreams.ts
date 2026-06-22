import {
  FINANCIAL_HIGHLIGHTS,
  ESG_HIGHLIGHTS,
  type FinancialHighlight,
} from "../annual-report/reportMockData";
import { REPORT_CHAPTER_TAGS } from "../annual-report/reportNavigation";
import {
  computeYoYPercent,
  latestMetricMn,
  latestMetricRaw,
} from "./simulatorChartData";
import { getMetricById } from "../annual-report/tenYearSummaryData";

export type ReportStreamId = "financial" | "success-story" | "esg";

export interface ReportStreamCard {
  title: string;
  value: string;
  changePercentage: string;
  comparison: string;
  trend: "up" | "down";
}

export interface ReportStream {
  id: ReportStreamId;
  chapter: string;
  title: string;
  tag: string;
  headline: string;
  description: string;
  stat: string;
  statLabel: string;
  color: string;
  glowColor: string;
  cards: ReportStreamCard[];
  metrics: { label: string; value: string }[];
}

function highlightToCard(h: FinancialHighlight): ReportStreamCard {
  return {
    title: h.title,
    value: h.value,
    changePercentage: h.changePercentage,
    comparison: h.comparison,
    trend: h.trend,
  };
}

const roe = getMetricById("roe")?.values["2025/26"];
const patMn = latestMetricMn("profit-for-year");
const revenueMn = latestMetricMn("revenue");

export const SIMULATOR_REPORT_STREAMS: ReportStream[] = [
  {
    id: "financial",
    chapter: REPORT_CHAPTER_TAGS.financial,
    title: "Financial Performance",
    tag: "AUDITED HEADLINES FY 25/26",
    headline: "Integrated Financial Resilience",
    description:
      "Audited headline indicators — revenue momentum, market valuation, equity strength and earnings efficiency for the reporting year.",
    stat: `${FINANCIAL_HIGHLIGHTS[0].value} Mn`,
    statLabel: "Group Revenue",
    color: "#C5A059",
    glowColor: "rgba(197, 160, 89, 0.22)",
    cards: FINANCIAL_HIGHLIGHTS.map(highlightToCard),
    metrics: FINANCIAL_HIGHLIGHTS.map((h) => ({
      label: h.title.split(" (")[0],
      value: `${h.value} · ${h.changePercentage}`,
    })),
  },
  {
    id: "success-story",
    chapter: REPORT_CHAPTER_TAGS.successStory,
    title: "Graphical Representation of Our Success Story",
    tag: "TEN YEAR SUMMARY 2025/26",
    headline: "Fifteen-Year Financial Trajectory",
    description:
      "Operating results, balance sheet strength and key performance indicators drawn from the audited Ten Year Summary workbook.",
    stat: revenueMn ? `${revenueMn} Mn` : "3,950 Mn",
    statLabel: "Revenue 2025/26",
    color: "#10B981",
    glowColor: "rgba(16, 185, 129, 0.2)",
    cards: [
      {
        title: "REVENUE (Rs' 000)",
        value: revenueMn ?? "3,950",
        changePercentage: computeYoYPercent("revenue") ?? "+6.8%",
        comparison: "vs 2024/25",
        trend: "up",
      },
      {
        title: "GROSS PROFIT (Rs' 000)",
        value: latestMetricMn("gross-profit") ?? "652",
        changePercentage: computeYoYPercent("gross-profit") ?? "+8.2%",
        comparison: "vs 2024/25",
        trend: "up",
      },
      {
        title: "PROFIT FOR THE YEAR (Rs' 000)",
        value: patMn ?? "137",
        changePercentage: computeYoYPercent("profit-for-year") ?? "+4.1%",
        comparison: "vs 2024/25",
        trend: "up",
      },
      {
        title: "RETURN ON EQUITY (%)",
        value: roe != null ? `${roe}` : "13.7",
        changePercentage: computeYoYPercent("roe") ?? "+12.5%",
        comparison: "vs 2024/25",
        trend: "up",
      },
    ],
    metrics: [
      { label: "Total Assets", value: `${latestMetricMn("total-assets") ?? "5,472"} Mn` },
      { label: "Shareholders' Equity", value: `${latestMetricMn("shareholders-equity") ?? "1,003"} Mn` },
      { label: "Operating Cashflow", value: `${latestMetricMn("operating-cashflow") ?? "358"} Mn` },
    ],
  },
  {
    id: "esg",
    chapter: REPORT_CHAPTER_TAGS.esg,
    title: "ESG Performance",
    tag: "REGENERATE FRAMEWORK ALIGNMENT",
    headline: "Balanced Value Creation",
    description:
      "Integrated profitability, shareholder value and sustainable capital growth indicators aligned with the Hayleys Plantations ESG Framework Regenerate.",
    stat: `${ESG_HIGHLIGHTS[0].value} Mn`,
    statLabel: "Gross Profit",
    color: "#34D399",
    glowColor: "rgba(52, 211, 153, 0.2)",
    cards: ESG_HIGHLIGHTS.map(highlightToCard),
    metrics: ESG_HIGHLIGHTS.map((h) => ({
      label: h.title.split(" (")[0],
      value: `${h.value} · ${h.changePercentage}`,
    })),
  },
];

export function baseForecastFromStream(streamId: ReportStreamId) {
  const pat = latestMetricRaw("profit-for-year");
  const revenue = latestMetricRaw("revenue");
  const equity = latestMetricRaw("shareholders-equity");

  const earningsMn = pat != null ? Math.round(pat / 1000) : 137;
  const revenueMnVal = revenue != null ? Math.round(revenue / 1000) : 3950;
  const jobs = equity != null ? Math.round(equity / 800) : 1200;

  if (streamId === "financial") {
    return { earnings: earningsMn, revenue: revenueMnVal, jobs };
  }
  if (streamId === "success-story") {
    return { earnings: earningsMn, revenue: revenueMnVal, jobs: jobs + 200 };
  }
  return {
    earnings: ESG_HIGHLIGHTS[1] ? parseInt(ESG_HIGHLIGHTS[1].value.replace(/,/g, ""), 10) || earningsMn : earningsMn,
    revenue: revenueMnVal,
    jobs,
  };
}
