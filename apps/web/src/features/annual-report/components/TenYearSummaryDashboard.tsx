import { useCallback, useId, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart,
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeftRight,
  BarChart3,
  Coins,
  FileSpreadsheet,
  Gauge,
  Landmark,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  TEN_YEAR_CATEGORIES,
  TEN_YEAR_FISCAL_YEARS,
  getMetricsByCategory,
  metricToChartData,
  type TenYearCategory,
  type TenYearMetric,
} from "../tenYearSummaryData";

type ChartType = "bar" | "line" | "area";

interface TenYearSummaryDashboardProps {
  variant?: "full" | "compact";
  defaultCategory?: TenYearCategory;
  defaultMetricId?: string;
  className?: string;
}

const CATEGORY_META: Record<
  TenYearCategory,
  { icon: typeof BarChart3; description: string }
> = {
  operating: { icon: BarChart3, description: "Revenue, profit & operating performance" },
  assets: { icon: Landmark, description: "Balance sheet assets & liabilities" },
  capital: { icon: Coins, description: "Equity, reserves & capital structure" },
  cashflow: { icon: ArrowLeftRight, description: "Operating, investing & financing flows" },
  "key-indicators": { icon: Gauge, description: "Ratios, yields & performance KPIs" },
};

const METRIC_GRID_HEIGHT = "h-[168px]";
const CHART_HEIGHT_FULL = "h-72 sm:h-80";
const CHART_HEIGHT_COMPACT = "h-44";
const STATS_ROW_HEIGHT = "h-[72px]";
const DESCRIPTION_HEIGHT = "h-5";
const BODY_MIN_HEIGHT_FULL = "min-h-[600px]";
const BODY_MIN_HEIGHT_COMPACT = "min-h-[360px]";

function formatMetricValue(value: number, unit: string): string {
  const isNeg = value < 0;
  const abs = Math.abs(value);

  if (unit === "Rs'000") {
    if (abs >= 1_000_000) return `${isNeg ? "−" : ""}Rs. ${(abs / 1_000_000).toFixed(2)} Bn`;
    if (abs >= 1_000) return `${isNeg ? "−" : ""}Rs. ${(abs / 1_000).toFixed(1)} Mn`;
    return `${isNeg ? "−" : ""}Rs. ${abs.toLocaleString("en-LK")} K`;
  }
  if (unit === "Rs. Cts.") return `Rs. ${value.toFixed(2)}`;
  if (unit === "%") return `${value.toFixed(2)}%`;
  if (unit === "Times") return `${value.toFixed(2)}×`;
  return value.toLocaleString("en-LK", { maximumFractionDigits: 2 });
}

function shortAxisValue(value: number, unit: string): string {
  const abs = Math.abs(value);
  if (unit === "Rs'000") {
    if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}B`;
    if (abs >= 1_000) return `${(value / 1_000).toFixed(0)}M`;
    return `${(value / 1_000).toFixed(0)}K`;
  }
  if (unit === "%") return `${value}%`;
  return `${value}`;
}

function computeYoY(metric: TenYearMetric) {
  const years = [...TEN_YEAR_FISCAL_YEARS];
  const latestYear = years[years.length - 1];
  const prevYear = years[years.length - 2];
  const latest = metric.values[latestYear];
  const prev = metric.values[prevYear];
  if (latest == null || prev == null || prev === 0) return null;
  return ((latest - prev) / Math.abs(prev)) * 100;
}

function buildFiscalYearTick(
  firstYear: string,
  lastYear: string,
  fontSize: number,
) {
  return function FiscalYearTick(props: {
    x?: string | number;
    y?: string | number;
    payload?: { value?: string | number };
  }) {
    const { x, y, payload } = props;
    if (x == null || y == null || !payload?.value) return null;

    const label = String(payload.value);
    const isFirst = label === firstYear;
    const isLast = label === lastYear;
    const anchor = isFirst ? "start" : isLast ? "end" : "middle";
    const xNum = typeof x === "number" ? x : parseFloat(String(x));
    const yNum = typeof y === "number" ? y : parseFloat(String(y));

    return (
      <text x={xNum} y={yNum} dy={14} fill="#6b7280" fontSize={fontSize} textAnchor={anchor}>
        {label}
      </text>
    );
  };
}

export function TenYearSummaryDashboard({
  variant = "full",
  defaultCategory = "operating",
  defaultMetricId = "revenue",
  className = "",
}: TenYearSummaryDashboardProps) {
  const chartUid = useId().replace(/:/g, "");
  const chartViewRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<TenYearCategory>(defaultCategory);
  const [metricId, setMetricId] = useState(defaultMetricId);
  const [chartType, setChartType] = useState<ChartType>("area");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [chartHighlight, setChartHighlight] = useState(false);

  const categoryMetrics = useMemo(() => getMetricsByCategory(category), [category]);
  const activeMetric = useMemo(
    () => categoryMetrics.find((m) => m.id === metricId) ?? categoryMetrics[0],
    [categoryMetrics, metricId],
  );

  const chartData = useMemo(
    () => (activeMetric ? metricToChartData(activeMetric) : []),
    [activeMetric],
  );

  const yoy = activeMetric ? computeYoY(activeMetric) : null;
  const latestPoint = chartData[chartData.length - 1];
  const peakPoint = chartData.reduce(
    (best, point) => (point.value > best.value ? point : best),
    chartData[0],
  );

  const isCompact = variant === "compact";
  const chartHeight = isCompact ? CHART_HEIGHT_COMPACT : CHART_HEIGHT_FULL;
  const activeCategoryMeta = CATEGORY_META[category];

  const scrollToChart = useCallback(() => {
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        const el = chartViewRef.current;
        if (!el) return;

        const navOffset = 88;
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop =
          rect.top + scrollTop - window.innerHeight / 2 + rect.height / 2 - navOffset / 2;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "smooth",
        });

        setChartHighlight(true);
        window.setTimeout(() => setChartHighlight(false), 1400);
      }, 120);
    });
  }, []);

  const handleCategoryChange = (next: TenYearCategory) => {
    if (next === category) return;
    setCategory(next);
    const first = getMetricsByCategory(next)[0];
    if (first) setMetricId(first.id);
    setHoverIndex(null);
    scrollToChart();
  };

  const handleMetricSelect = (id: string) => {
    if (id === metricId) return;
    setMetricId(id);
    scrollToChart();
  };

  const handleChartTypeChange = (type: ChartType) => {
    if (type === chartType) return;
    setChartType(type);
    scrollToChart();
  };

  const renderChart = () => {
    if (!activeMetric || chartData.length === 0) return null;

    const goldFillId = `tenYearGoldFill-${chartUid}`;
    const emeraldStrokeId = `tenYearEmeraldStroke-${chartUid}`;
    const firstYear = chartData[0]?.year ?? "";
    const lastYear = chartData[chartData.length - 1]?.year ?? "";
    const tickFontSize = isCompact ? 8 : 9;
    const FiscalYearTick = buildFiscalYearTick(firstYear, lastYear, tickFontSize);

    const commonProps = {
      data: chartData,
      margin: { left: isCompact ? -6 : 4, right: 28, top: 12, bottom: 12 },
      onMouseMove: (state: { activeTooltipIndex?: number | string | null }) => {
        const index = state?.activeTooltipIndex;
        if (typeof index === "number") setHoverIndex(index);
      },
      onMouseLeave: () => setHoverIndex(null),
    };

    const axisProps = {
      stroke: "#6b7280",
      fontSize: tickFontSize,
      tickLine: false,
      axisLine: false,
    };

    const xAxisProps = {
      dataKey: "year" as const,
      ...axisProps,
      dy: 4,
      interval: (isCompact ? 2 : 1) as number,
      tick: FiscalYearTick,
      padding: { left: 12, right: 20 },
      tickMargin: 8,
    };

    const tooltip = (
      <Tooltip
        cursor={{ fill: "rgba(197, 160, 89, 0.06)" }}
        content={({ active, payload }) => {
          if (!active || !payload?.length) return null;
          const item = payload[0].payload as { year: string; value: number };
          return (
            <div className="rounded-xl border border-[#C5A059]/40 bg-[#0a120e]/95 px-3 py-2.5 shadow-2xl backdrop-blur-md">
              <p className="font-mono text-[9px] uppercase tracking-widest text-zinc-500">{item.year}</p>
              <p className="mt-1 font-serif text-sm font-bold text-[#E5C079]">
                {formatMetricValue(item.value, activeMetric.unit)}
              </p>
              <p className="mt-1 font-mono text-[8px] text-zinc-500">{activeMetric.unit}</p>
            </div>
          );
        }}
      />
    );

    if (chartType === "bar") {
      return (
        <BarChart {...commonProps} barSize={isCompact ? 18 : 28}>
          <CartesianGrid stroke="rgba(197,160,89,0.07)" strokeDasharray="3 3" vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis
            {...axisProps}
            width={isCompact ? 32 : 44}
            tickFormatter={(v) => shortAxisValue(v, activeMetric.unit)}
          />
          {tooltip}
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, idx) => {
              const isNeg = entry.value < 0;
              const base = isNeg ? "#f87171" : idx % 2 === 0 ? "#10b981" : "#C5A059";
              const fill = hoverIndex === idx ? (isNeg ? "#fca5a5" : "#E5C079") : base;
              return (
                <Cell
                  key={entry.year}
                  fill={fill}
                  opacity={hoverIndex !== null && hoverIndex !== idx ? 0.45 : 1}
                />
              );
            })}
          </Bar>
        </BarChart>
      );
    }

    if (chartType === "line") {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid stroke="rgba(197,160,89,0.07)" strokeDasharray="3 3" vertical={false} />
          <XAxis {...xAxisProps} />
          <YAxis
            {...axisProps}
            width={isCompact ? 32 : 44}
            tickFormatter={(v) => shortAxisValue(v, activeMetric.unit)}
          />
          {tooltip}
          <Line
            type="monotone"
            dataKey="value"
            stroke="#C5A059"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: "#05110c", stroke: "#10b981", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#E5C079", stroke: "#05110c", strokeWidth: 2 }}
          />
        </LineChart>
      );
    }

    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id={goldFillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#C5A059" stopOpacity={0} />
          </linearGradient>
          <linearGradient id={emeraldStrokeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#C5A059" />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(197,160,89,0.07)" strokeDasharray="3 3" vertical={false} />
        <XAxis {...xAxisProps} />
        <YAxis
          {...axisProps}
          width={isCompact ? 32 : 44}
          tickFormatter={(v) => shortAxisValue(v, activeMetric.unit)}
        />
        {tooltip}
        <Area
          type="monotone"
          dataKey="value"
          stroke={`url(#${emeraldStrokeId})`}
          strokeWidth={2.5}
          fill={`url(#${goldFillId})`}
        />
      </AreaChart>
    );
  };

  return (
    <div
      className={`w-full min-w-0 overflow-hidden rounded-2xl border border-[#C5A059]/25 bg-gradient-to-br from-[#05110c] via-[#040a07] to-[#0B2118] shadow-[0_24px_60px_rgba(0,0,0,0.45)] ${className}`}
    >
      {/* Header */}
      <div className={`w-full border-b border-[#C5A059]/15 ${isCompact ? "p-3" : "p-5 sm:p-6"}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#C5A059]">
              <FileSpreadsheet className="h-3 w-3" />
              Ten Year Summary 2025/26
            </span>
            <h3
              className={`mt-2 font-serif italic leading-tight text-white ${isCompact ? "text-base" : "text-xl sm:text-2xl"}`}
            >
              Graphical Representation of Our{" "}
              <span className="text-[#E5C079] not-italic">Success Story</span>
            </h3>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 p-0.5">
            {(["bar", "line", "area"] as ChartType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleChartTypeChange(type)}
                className={`rounded-md px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  chartType === type
                    ? "bg-[#C5A059] text-black shadow-[0_0_12px_rgba(197,160,89,0.35)]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Category tabs — equal-width grid, full card width */}
        <div className={`mt-5 w-full ${isCompact ? "" : "mt-6"}`}>
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {TEN_YEAR_CATEGORIES.map((cat) => {
              const isActive = category === cat.id;
              const Icon = CATEGORY_META[cat.id].icon;
              const metricCount = getMetricsByCategory(cat.id).length;

              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group relative w-full min-w-0 cursor-pointer overflow-hidden rounded-xl border px-2.5 py-2.5 text-left transition-colors sm:px-3 sm:py-3 ${
                    isActive
                      ? "border-[#C5A059]/60 bg-[#C5A059]/12 shadow-[0_0_24px_rgba(197,160,89,0.12)]"
                      : "border-white/10 bg-white/[0.02] hover:border-[#C5A059]/35 hover:bg-white/[0.04]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={`category-glow-${chartUid}`}
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#C5A059]/10 to-transparent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors sm:h-8 sm:w-8 ${
                        isActive
                          ? "border-[#C5A059]/50 bg-[#C5A059]/20 text-[#E5C079]"
                          : "border-white/10 bg-black/30 text-zinc-500 group-hover:text-[#C5A059]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate font-mono text-[8px] font-bold uppercase tracking-wider sm:text-[9px] ${
                          isActive ? "text-[#E5C079]" : "text-zinc-300 group-hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </p>
                      {!isCompact && (
                        <p className="mt-0.5 truncate font-mono text-[7px] text-zinc-600 sm:text-[8px]">
                          {metricCount} metrics
                        </p>
                      )}
                    </div>
                  </div>
                  {isActive && (
                    <motion.span
                      layoutId={`category-line-${chartUid}`}
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-emerald-400 via-[#C5A059] to-[#E5C079]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className={`mt-3 ${DESCRIPTION_HEIGHT} overflow-hidden`}>
            <AnimatePresence mode="wait">
              <motion.p
                key={category}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="truncate font-mono text-[9px] uppercase tracking-wider text-zinc-500"
              >
                {activeCategoryMeta.description} · Select a metric below
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Body — fixed layout slots */}
      <div
        className={`w-full ${isCompact ? `p-3 ${BODY_MIN_HEIGHT_COMPACT}` : `p-5 sm:p-6 ${BODY_MIN_HEIGHT_FULL}`}`}
      >
        {/* Metric picker — fixed size scroll area */}
        <div
          className={`${isCompact ? "h-28" : METRIC_GRID_HEIGHT} mb-4 w-full overflow-y-auto rounded-xl border border-white/[0.05] bg-black/20 p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#C5A059]/25`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={category}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`grid w-full gap-2 ${isCompact ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}
            >
              {categoryMetrics.map((metric, idx) => {
                const isSelected = metric.id === activeMetric?.id;
                return (
                  <motion.button
                    key={metric.id}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.2) }}
                    onClick={() => handleMetricSelect(metric.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full min-w-0 cursor-pointer rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? "border-[#C5A059]/55 bg-[#C5A059]/12 shadow-[inset_0_0_0_1px_rgba(197,160,89,0.2),0_0_16px_rgba(197,160,89,0.08)]"
                        : "border-white/8 bg-white/[0.02] hover:border-[#C5A059]/30 hover:bg-white/[0.05]"
                    }`}
                  >
                    <p className="truncate font-mono text-[8px] uppercase tracking-wider text-zinc-500">
                      {metric.unit}
                    </p>
                    <p
                      className={`mt-0.5 line-clamp-2 font-serif leading-snug text-white ${isCompact ? "text-[11px]" : "text-sm"}`}
                    >
                      {metric.label}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stats + chart — scroll target */}
        <div ref={chartViewRef} className="scroll-mt-24">
        {/* Stats — fixed height row */}
        <div
          className={`mb-4 grid w-full gap-2 ${isCompact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4"} ${STATS_ROW_HEIGHT}`}
        >
          <AnimatePresence mode="wait">
            {activeMetric && latestPoint && peakPoint && (
              <motion.div
                key={`${category}-${activeMetric.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className={`contents`}
              >
                <StatCard
                  label={`Latest (${latestPoint.year})`}
                  value={formatMetricValue(latestPoint.value, activeMetric.unit)}
                  compact={isCompact}
                />
                <StatCard
                  label="YoY Change"
                  value={yoy == null ? "—" : `${yoy >= 0 ? "+" : ""}${yoy.toFixed(1)}%`}
                  tone={yoy == null ? "neutral" : yoy >= 0 ? "positive" : "negative"}
                  icon={yoy != null && yoy >= 0 ? TrendingUp : TrendingDown}
                  compact={isCompact}
                />
                <StatCard
                  label={`Peak (${peakPoint.year})`}
                  value={formatMetricValue(peakPoint.value, activeMetric.unit)}
                  compact={isCompact}
                />
                <StatCard
                  label="Data Points"
                  value={`${chartData.length} years`}
                  compact={isCompact}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chart — fixed height */}
        <div
          className={`${chartHeight} w-full min-w-0 shrink-0 overflow-hidden rounded-xl border bg-black/20 p-2 transition-[box-shadow,border-color] duration-700 sm:p-3 ${
            chartHighlight
              ? "border-[#C5A059]/50 shadow-[0_0_40px_rgba(197,160,89,0.18)]"
              : "border-white/5"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${activeMetric?.id}-${chartType}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                {renderChart() ?? <div />}
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>

        <p className="mt-3 font-mono text-[8px] uppercase tracking-wider text-zinc-600">
          Source: Horana Plantations PLC — Ten Year Summary 2025/26 (audited figures, Rs&apos;000 unless stated)
        </p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone = "neutral",
  icon: Icon,
  compact,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative";
  icon?: typeof TrendingUp;
  compact?: boolean;
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-400"
      : tone === "negative"
        ? "text-red-400"
        : "text-[#E5C079]";

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5 h-full min-h-0 overflow-hidden">
      <p className="truncate font-mono text-[8px] uppercase tracking-wider text-zinc-500">{label}</p>
      <div className="mt-1 flex min-w-0 items-center gap-1.5">
        {Icon && <Icon className={`h-3.5 w-3.5 shrink-0 ${toneClass}`} />}
        <p className={`truncate font-serif font-bold ${toneClass} ${compact ? "text-sm" : "text-base"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
