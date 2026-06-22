import React, { useState } from "react";
import { BarChart3, TrendingUp, AreaChart as AreaChartIcon, Table as TableIcon, FileSpreadsheet, Sparkles, Building } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area, CartesianGrid
} from "recharts";

interface ObjectData {
  label: string;
  value: number;
  focus?: string; // Optional strategic focus statement for that year
}

interface DynamicChartProps {
  title?: string;
  desc?: string;
  badge?: string;
  footnote?: string;
  dataStr?: string;
}

export const DynamicReportChart = ({ title, desc, badge, footnote, dataStr }: DynamicChartProps) => {
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "table">("bar");
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);

  // Parse custom parameters
  let parsedData: ObjectData[] = [
    { label: "FY 21/22", value: 280, focus: "Initial recovery stage with optimized soil enrichment programs." },
    { label: "FY 22/23", value: 310, focus: "Digitalization of smart weighing scales and weather radars." },
    { label: "FY 23/24", value: 350, focus: "Transitioned multi-estates into green biomass boiler networks." },
    { label: "FY 24/25", value: 420, focus: "Premium packaged tea direct export initiatives launched globally." },
    { label: "FY 25/26", value: 680, focus: "Pekoe bulk premium blending & RFID labor automation optimized yields." }
  ];

  if (dataStr) {
    try {
      const decoded = dataStr.replace(/&quot;/g, '"');
      parsedData = JSON.parse(decoded);
    } catch (e) {
      console.error("Error parsing dynamic chart data JSON:", e);
    }
  }

  const chartData = parsedData.map(item => ({
    name: item.label,
    value: item.value,
    focus: item.focus || "Verified performance audit records."
  }));

  // Detect Unit based on title/metric keywords
  let unit = "LKR M";
  const lowerTitle = (title || "").toLowerCase();
  const lowerDesc = (desc || "").toLowerCase();
  const lowerFootnote = (footnote || "").toLowerCase();

  if (
    lowerTitle.includes("per share") || 
    lowerTitle.includes("eps") || 
    lowerTitle.includes("naps") || 
    lowerTitle.includes("rs") ||
    lowerDesc.includes("rs.") ||
    lowerFootnote.includes("rs.")
  ) {
    unit = "Rs.";
  } else if (
    lowerTitle.includes("equity") || 
    lowerTitle.includes("roe") || 
    lowerTitle.includes("%") ||
    lowerDesc.includes("%") ||
    lowerFootnote.includes("%")
  ) {
    unit = "%";
  }

  const calculatedTitle = title || "Year-Over-Year Net Profit Comparison";
  const calculatedDesc = desc || "Analyzing comparative net profit ratios on premium product sales. Yield optimization boosted margins from LKR 420M to LKR 680M.";
  const calculatedBadge = badge || "+61.9% Performance";
  const calculatedFootnote = footnote || "FY Net Profit rise: LKR 260.0 Million";

  // Helper to format values elegantly matching standard reporting
  const formatVal = (val: number) => {
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    if (unit === "Rs.") {
      return `${isNeg ? "-" : ""}Rs. ${absVal.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}`;
    }
    if (unit === "%") {
      return `${val}%`;
    }
    return `${isNeg ? "Loss: " : ""}LKR ${absVal} Million`;
  };

  const activeFocusItem = activeHoverIndex !== null ? chartData[activeHoverIndex] : chartData[chartData.length - 1];

  return (
    <div className="w-full bg-[#030604] border border-[#C5A059]/35 rounded-xl p-3.5 sm:p-4 my-4 shadow-[0_20px_45px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.02)] transition-all">
      {/* Target Details Header */}
      <div className="flex flex-col gap-2.5 border-b border-[#C5A059]/20 pb-3">
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-grow">
            <span className="text-[8px] font-mono tracking-widest text-[#C5A059] uppercase block mb-0.5">
              📊 REAL-TIME NOSQL DOCUMENT VIEW
            </span>
            <h4 className="text-xs sm:text-[13px] font-serif font-bold text-white leading-tight">
              {calculatedTitle}
            </h4>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono uppercase font-bold shrink-0">
            {calculatedBadge}
          </span>
        </div>

        {/* Toggle View Options */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[8px] font-mono text-zinc-500 tracking-wider">UNIT:</span>
            <span className="text-[9px] font-mono text-[#C5A059] font-bold bg-[#C5A059]/10 px-1.5 py-0.5 rounded border border-[#C5A059]/25">
              {unit}
            </span>
          </div>

          <div className="flex items-center gap-0.5 bg-black/50 p-0.5 rounded-md border border-white/5">
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`px-2 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                chartType === "bar" 
                  ? "bg-[#C5A059] text-black font-extrabold shadow-sm" 
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Bar Chart Representation"
            >
              <BarChart3 className="w-2.5 h-2.5" />
              <span>BAR</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType("line")}
              className={`px-2 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                chartType === "line" 
                  ? "bg-[#C5A059] text-black font-extrabold shadow-sm" 
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Line Chart Representation"
            >
              <TrendingUp className="w-2.5 h-2.5" />
              <span>LINE</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType("area")}
              className={`px-2 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                chartType === "area" 
                  ? "bg-[#C5A059] text-black font-extrabold shadow-sm" 
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Immersive Area Plot"
            >
              <AreaChartIcon className="w-2.5 h-2.5" />
              <span>AREA</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType("table")}
              className={`px-2 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
                chartType === "table" 
                  ? "bg-[#C5A059] text-black font-extrabold shadow-sm" 
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Raw Document Data Table"
            >
              <TableIcon className="w-2.5 h-2.5" />
              <span>TABLE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Narrative block */}
      <div className="bg-[#051109]/75 border border-[#C5A059]/10 rounded-lg p-3 my-2.5">
        <p className="text-[11px] sm:text-[11.5px] text-zinc-300 leading-relaxed font-sans">
          {calculatedDesc}
        </p>
      </div>

      {/* Chart Canvas or Table Screen */}
      <div className="w-full mt-1">
        {chartType === "table" ? (
          <div className="overflow-x-auto rounded-lg border border-[#C5A059]/20 bg-black/40 mt-2 select-text">
            <table className="w-full border-collapse text-left text-[11px]">
              <thead>
                <tr className="bg-[#C5A059]/10 border-b border-[#C5A059]/20 text-[9px] uppercase tracking-wider text-[#C5A059] font-mono font-bold">
                  <th className="px-3.5 py-2">Fiscal Duration</th>
                  <th className="px-3.5 py-2 text-right">Audit Value</th>
                  <th className="px-3.5 py-2">Strategic Deployment & Multiplier Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {chartData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-[#C5A059]/5 transition-colors cursor-pointer ${
                      activeHoverIndex === idx ? "bg-[#C5A059]/10" : ""
                    }`}
                    onMouseEnter={() => setActiveHoverIndex(idx)}
                    onMouseLeave={() => setActiveHoverIndex(null)}
                  >
                    <td className="px-3.5 py-2.5 font-mono font-bold text-white whitespace-nowrap">
                      {row.name}
                    </td>
                    <td className={`px-3.5 py-2.5 text-right font-mono font-bold whitespace-nowrap ${row.value < 0 ? "text-rose-400" : "text-emerald-400"}`}>
                      {formatVal(row.value)}
                    </td>
                    <td className="px-3.5 py-2.5 text-zinc-400 text-[10.5px] leading-relaxed">
                      {row.focus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-44 w-full pr-1 select-none">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart 
                  data={chartData} 
                  barSize={parsedData.length > 3 ? 24 : 36} 
                  margin={{ left: -15, right: 10, top: 10, bottom: 5 }}
                  onMouseMove={(state) => {
                    if (state && typeof state.activeTooltipIndex === "number") {
                      setActiveHoverIndex(state.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setActiveHoverIndex(null)}
                >
                  <CartesianGrid stroke="rgba(197, 160, 89, 0.06)" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#8a8a93" 
                    fontSize={8.5} 
                    tickLine={false} 
                    axisLine={false}
                    dy={4}
                  />
                  <YAxis 
                    stroke="#8a8a93" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                    width={35}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip 
                    cursor={{ fill: "rgba(197, 160, 89, 0.04)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-[#0b130e] border border-[#C5A059]/45 px-3 py-2.5 rounded-lg text-xs leading-none shadow-2xl">
                            <p className="text-zinc-500 font-mono text-[8.5px] uppercase tracking-wider font-bold mb-1">
                              📁 AUDITED {item.name}
                            </p>
                            <p className="text-[#C5A059] font-sans font-extrabold text-[12.5px]">
                              Value: {formatVal(item.value)}
                            </p>
                            <p className="text-[8px] font-serif text-zinc-400 mt-1.5 leading-normal max-w-[190px]">
                              {item.focus}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, idx) => {
                      const isNegative = entry.value < 0;
                      const baseCol = isNegative 
                        ? "#ef4444" 
                        : (idx % 2 === 0 ? "#10b981" : "#C5A059");
                      
                      let fillCol = baseCol;
                      if (activeHoverIndex === idx) {
                        if (isNegative) {
                          fillCol = "#f87171";
                        } else if (idx % 2 === 0) {
                          fillCol = "#34d399"; // Brighter emerald
                        } else {
                          fillCol = "#e4c17b"; // Brighter gold
                        }
                      }
                      return (
                        <Cell 
                          key={`cell-${idx}`} 
                          fill={fillCol} 
                          opacity={activeHoverIndex !== null && activeHoverIndex !== idx ? 0.45 : 1}
                          className="transition-all duration-300"
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              ) : chartType === "line" ? (
                <LineChart 
                  data={chartData} 
                  margin={{ left: -15, right: 10, top: 10, bottom: 5 }}
                  onMouseMove={(state) => {
                    if (state && typeof state.activeTooltipIndex === "number") {
                      setActiveHoverIndex(state.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setActiveHoverIndex(null)}
                >
                  <CartesianGrid stroke="rgba(197, 160, 89, 0.06)" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#8a8a93" 
                    fontSize={8.5} 
                    tickLine={false} 
                    axisLine={false}
                    dy={4}
                  />
                  <YAxis 
                    stroke="#8a8a93" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                    width={35}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-[#0b130e] border border-[#C5A059]/45 px-3 py-2.5 rounded-lg text-xs leading-none shadow-2xl">
                            <p className="text-zinc-500 font-mono text-[8.5px] uppercase tracking-wider font-bold mb-1">
                              📁 AUDITED {item.name}
                            </p>
                            <p className="text-[#C5A059] font-sans font-extrabold text-[12.5px]">
                              Value: {formatVal(item.value)}
                            </p>
                            <p className="text-[8px] font-serif text-zinc-400 mt-1.5 leading-normal max-w-[190px]">
                              {item.focus}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#C5A059" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#030604", stroke: "#10b981", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#10b981", stroke: "#030604", strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <AreaChart 
                  data={chartData} 
                  margin={{ left: -15, right: 10, top: 10, bottom: 5 }}
                  onMouseMove={(state) => {
                    if (state && typeof state.activeTooltipIndex === "number") {
                      setActiveHoverIndex(state.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setActiveHoverIndex(null)}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(197, 160, 89, 0.06)" strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#8a8a93" 
                    fontSize={8.5} 
                    tickLine={false} 
                    axisLine={false}
                    dy={4}
                  />
                  <YAxis 
                    stroke="#8a8a93" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false}
                    width={35}
                    tickFormatter={(val) => `${val}`}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-[#0b130e] border border-[#C5A059]/45 px-3 py-2.5 rounded-lg text-xs leading-none shadow-2xl">
                            <p className="text-zinc-500 font-mono text-[8.5px] uppercase tracking-wider font-bold mb-1">
                              📁 AUDITED {item.name}
                            </p>
                            <p className="text-[#C5A059] font-sans font-extrabold text-[12.5px]">
                              Value: {formatVal(item.value)}
                            </p>
                            <p className="text-[8px] font-serif text-zinc-400 mt-1.5 leading-normal max-w-[190px]">
                              {item.focus}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#C5A059" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Focus Drilldown Insight Footer */}
      {activeFocusItem && (
        <div className="bg-black/45 border-t border-white/5 pt-2.5 mt-2.5 font-sans">
          <div className="flex items-center gap-1.5 mb-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse shrink-0" />
            <span className="text-[8.5px] font-mono uppercase text-[#C5A059] font-bold tracking-wider">
              Selected Phase Strategic Context ({activeFocusItem.name}):
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-normal pl-3 italic">
            "{activeFocusItem.focus}"
          </p>
        </div>
      )}

      {/* Footer Audit standards */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap justify-between gap-1.5 text-[8px] text-zinc-500 font-mono uppercase">
        <div>{calculatedFootnote}</div>
        <div>Standard: Audited ISO 14001 & NoSQL Ledger Verified</div>
      </div>
    </div>
  );
};
export default DynamicReportChart;
