import {
  TEN_YEAR_FISCAL_YEARS,
  getMetricById,
  type TenYearMetric,
} from "../annual-report/tenYearSummaryData";

export interface SimulatorTrendPoint {
  label: string;
  financial: number;
  esg: number;
}

function shortYear(year: string): string {
  const parts = year.split("/");
  if (parts.length !== 2) return year;
  return `${parts[0].slice(-2)}/${parts[1]}`;
}

function seriesFromMetric(metric: TenYearMetric | undefined): Record<string, number> {
  if (!metric) return {};
  const out: Record<string, number> = {};
  for (const year of TEN_YEAR_FISCAL_YEARS) {
    const v = metric.values[year];
    if (v != null) out[year] = v;
  }
  return out;
}

/** Revenue (Mn) and Gross Profit (Mn) — audited ten-year series for the glass chart */
export function buildSimulatorTrendData(): SimulatorTrendPoint[] {
  const revenue = seriesFromMetric(getMetricById("revenue"));
  const grossProfit = seriesFromMetric(getMetricById("gross-profit"));

  return TEN_YEAR_FISCAL_YEARS.flatMap((year) => {
    const rev = revenue[year];
    const gp = grossProfit[year];
    if (rev == null || gp == null) return [];
    return [
      {
        label: shortYear(year),
        financial: Math.round(rev / 1000),
        esg: Math.round(gp / 1000),
      },
    ];
  });
}

export function getTrendValueBounds(data: SimulatorTrendPoint[]): { min: number; max: number } {
  if (data.length === 0) return { min: 0, max: 100 };
  const vals = data.flatMap((d) => [d.financial, d.esg]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.08 || 1;
  return { min: min - pad, max: max + pad };
}

export function computeYoYPercent(metricId: string): string | null {
  const metric = getMetricById(metricId);
  if (!metric) return null;
  const years = [...TEN_YEAR_FISCAL_YEARS];
  const latest = years[years.length - 1];
  const prev = years[years.length - 2];
  const a = metric.values[latest];
  const b = metric.values[prev];
  if (a == null || b == null || b === 0) return null;
  const pct = ((a - b) / Math.abs(b)) * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`;
}

export function latestMetricMn(metricId: string): string | null {
  const metric = getMetricById(metricId);
  if (!metric) return null;
  const years = [...TEN_YEAR_FISCAL_YEARS];
  const v = metric.values[years[years.length - 1]];
  if (v == null) return null;
  return (v / 1000).toLocaleString("en-LK", { maximumFractionDigits: 0 });
}

export function latestMetricRaw(metricId: string): number | null {
  const metric = getMetricById(metricId);
  if (!metric) return null;
  const years = [...TEN_YEAR_FISCAL_YEARS];
  const v = metric.values[years[years.length - 1]];
  return v ?? null;
}
