import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, AreaChart as AreaIcon, Database, ArrowRight, Play, Loader, CheckCircle } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area, CartesianGrid
} from "recharts";
import { queryDocumentStore, getRegisteredMetrics, NoSQLDocument } from "../../../data/mockNoSQLDatabase";

export const YearlyProfitChart = () => {
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("area");
  const [selectedMetric, setSelectedMetric] = useState<string>("pat");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryLog, setQueryLog] = useState<string>("");
  const [records, setRecords] = useState<NoSQLDocument[]>([]);
  const [activeHoverIndex, setActiveHoverIndex] = useState<number | null>(null);

  const metrics = getRegisteredMetrics();

  // Load and query database records whenever selectedMetric shifts
  useEffect(() => {
    let active = true;
    const fetchDB = async () => {
      setIsLoading(true);
      setQueryLog(`db.collection("financial_indicators").where("metricId", "==", "${selectedMetric}").orderBy("year", "asc")`);
      try {
        const data = await queryDocumentStore("financial_indicators", {
          metricId: selectedMetric as any
        });
        if (active) {
          setRecords(data);
        }
      } catch (err) {
        console.error("Error querying mock Firestore collection:", err);
      } finally {
        setTimeout(() => {
          if (active) setIsLoading(false);
        }, 350); // Small duration to make visual query feeling professional
      }
    };

    fetchDB();
    return () => {
      active = false;
    };
  }, [selectedMetric]);

  const activeMetricMeta = metrics.find(m => m.id === selectedMetric) || metrics[2];

  // Map to chart items
  const chartData = records.map(r => ({
    name: r.year,
    value: r.value,
    focus: r.strategicFocus
  }));

  const formatVal = (val: number, unit: string) => {
    const isNeg = val < 0;
    const absVal = Math.abs(val);
    if (unit === "Rs.") return `${isNeg ? "-" : ""}Rs. ${absVal}`;
    if (unit === "%") return `${val}%`;
    return `${isNeg ? "Loss: " : ""}LKR ${absVal}M`;
  };

  const getMetricDesc = (id: string) => {
    switch(id) {
      case "revenue": return "Value-added tea package exports and primary commodity trade performance.";
      case "pbt": return "Earnings before taxation adjustments, reflecting pure operational strength.";
      case "pat": return "Net profit after taxes and corporate social reinvestment allocations.";
      case "eps": return "Basic earnings per standard share unit returned to equity holders.";
      case "naps": return "Net asset value per share asset backing, demonstrating robust physical capital resources.";
      case "roe": return "Operational efficiency yield percentage measured against core leverage capital.";
      default: return "";
    }
  };

  return (
    <div className="w-full bg-[#040806]/95 border border-[#C5A059]/25 rounded-2xl p-4 my-4 shadow-[0_20px_45px_rgba(0,0,0,0.7)] animate-fadeIn">
      {/* Header with DB badge */}
      <div className="flex flex-col gap-2.5 border-b border-[#C5A059]/15 pb-3">
        <div className="flex justify-between items-start gap-1.5">
          <div>
            <span className="text-[8px] font-mono tracking-widest text-[#C5A059] uppercase flex items-center gap-1.5 font-bold">
              <Database className="w-3 h-3 text-emerald-400" />
              INTEGRATED NOSQL DATABASE EXPLORER
            </span>
            <h4 className="text-xs sm:text-sm font-serif font-bold text-white mt-1 leading-tight flex items-center gap-2">
              <span>{activeMetricMeta.name}</span>
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[8px] font-mono font-bold">
              COLLECTION: financial_indicators
            </span>
          </div>
        </div>

        {/* Console Query display */}
        <div className="bg-black/90 rounded-lg p-2 font-mono text-[9.5px] border border-white/5 flex items-center justify-between text-zinc-400">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-emerald-500">▶</span>
            <span className="truncate text-emerald-300 font-bold">{queryLog}</span>
          </div>
          {isLoading ? (
            <span className="text-amber-400 flex items-center gap-1 shrink-0 font-bold text-[8.5px]">
              <Loader className="w-2.5 h-2.5 animate-spin" /> FETCHING_DATA
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 shrink-0 font-bold text-[8.5px]">
              <CheckCircle className="w-2.5 h-2.5 text-emerald-500" /> ACTIVE_SYNC
            </span>
          )}
        </div>
      </div>

      {/* Selector switches of all indicators user listed in prompt */}
      <div className="py-2.5 border-b border-white/5">
        <span className="text-[8px] font-mono uppercase text-zinc-500 block mb-1.5">
          Select document field to execute NoSQL query:
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1">
          {metrics.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMetric(m.id)}
              className={`px-1.5 py-1.5 rounded-lg text-[9px] font-mono border font-bold transition-all cursor-pointer ${
                selectedMetric === m.id
                  ? "bg-[#C5A059]/20 text-[#C5A059] border-[#C5A059]/50 shadow-md"
                  : "bg-black/40 text-zinc-400 border-white/5 hover:border-zinc-700 hover:text-zinc-300"
              }`}
            >
              <div className="truncate">{m.name.slice(0, 16)}...</div>
              <div className="text-[7.5px] scale-90 text-zinc-500 text-left truncate">{m.id.toUpperCase()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Type Switches & Decription */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 my-3 relative">
        <div className="text-[10px] sm:text-[10.5px] text-zinc-300 leading-normal max-w-sm sm:max-w-md">
          {getMetricDesc(selectedMetric)}
        </div>

        <div className="flex items-center gap-0.5 bg-black/40 p-0.5 rounded-md border border-white/5 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setChartType("bar")}
            className={`px-2 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
              chartType === "bar" 
                ? "bg-[#C5A059] text-black font-extrabold" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-2.5 h-2.5" />
            <span>BAR</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType("line")}
            className={`px-2 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
              chartType === "line" 
                ? "bg-[#C5A059] text-black font-extrabold" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-2.5 h-2.5" />
            <span>LINE</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType("area")}
            className={`px-2 py-0.5 rounded text-[8px] font-mono flex items-center gap-1 cursor-pointer transition-all ${
              chartType === "area" 
                ? "bg-[#C5A059] text-black font-extrabold" 
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <AreaIcon className="w-2.5 h-2.5" />
            <span>AREA</span>
          </button>
        </div>
      </div>

      {/* Responsive Recharts Canvas */}
      <div className="w-full relative min-h-[176px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-xl backdrop-blur-[2px] border border-white/5">
            <Loader className="w-6 h-6 text-[#C5A059] animate-spin" />
            <span className="text-[10.5px] font-mono text-zinc-400 mt-2">
              Query Executing: Loading Collection Results...
            </span>
          </div>
        ) : null}

        <div className="h-44 w-full pr-1 select-none">
          {records.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "bar" ? (
                <BarChart 
                  data={chartData} 
                  barSize={25} 
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
                          <div className="bg-[#0b130e] border border-[#C5A059]/45 px-3 py-2 rounded-lg text-xs leading-none shadow-2xl">
                            <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-wider">{item.name}</p>
                            <p className="text-[#C5A059] font-sans font-bold text-xs mt-1">
                              Value: {formatVal(item.value, activeMetricMeta.defaultUnit)}
                            </p>
                            <p className="text-[7.5px] text-zinc-400 font-mono leading-relaxed mt-1.5 max-w-xs">{item.focus}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, idx) => {
                      const isNegative = entry.value < 0;
                      const baseCol = isNegative ? "#ef4444" : (idx % 2 === 0 ? "#10b981" : "#C5A059");
                      
                      let fillCol = baseCol;
                      if (activeHoverIndex === idx) {
                        if (isNegative) {
                          fillCol = "#f87171";
                        } else if (idx % 2 === 0) {
                          fillCol = "#34d399";
                        } else {
                          fillCol = "#e4c17b";
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
                <LineChart data={chartData} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
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
                          <div className="bg-[#0b130e] border border-[#C5A059]/45 px-3 py-2 rounded-lg text-xs leading-none shadow-2xl">
                            <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-wider">{item.name}</p>
                            <p className="text-[#C5A059] font-sans font-bold text-xs mt-1">
                              Value: {formatVal(item.value, activeMetricMeta.defaultUnit)}
                            </p>
                            <p className="text-[7.5px] text-zinc-400 font-mono leading-relaxed mt-1.5 max-w-xs">{item.focus}</p>
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
                    dot={{ r: 4, fill: "#040806", stroke: "#10b981", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#C5A059", stroke: "#040806", strokeWidth: 2 }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={chartData} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorValueExplore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorGoldExplore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.45}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0.0}/>
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
                          <div className="bg-[#0b130e] border border-[#C5A059]/45 px-3 py-2 rounded-lg text-xs leading-none shadow-2xl">
                            <p className="text-zinc-500 font-mono text-[8px] uppercase tracking-wider">{item.name}</p>
                            <p className="text-[#C5A059] font-sans font-bold text-xs mt-1">
                              Value: {formatVal(item.value, activeMetricMeta.defaultUnit)}
                            </p>
                            <p className="text-[7.5px] text-zinc-400 font-mono leading-relaxed mt-1.5 max-w-xs">{item.focus}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValueExplore)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Strategic Focus Bullet info line */}
      <div className="border-t border-white/5 pt-2.5 mt-2.5 flex items-center justify-between text-[8px] text-zinc-500 font-mono uppercase">
        <div>SYSTEM STATUS: READY FOR DYNAMIC INGRESS CONNECTIVITY</div>
        <div>Standard: Audited NoSQL Document DB-05</div>
      </div>
    </div>
  );
};
export default YearlyProfitChart;
