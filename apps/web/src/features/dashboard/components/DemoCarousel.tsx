import React, { useState, useRef, useEffect } from "react";
import { 
  TrendingUp, ArrowLeft, ArrowRight, Radio, BarChart3, Coins, Leaf
} from "lucide-react";
import { SIMULATOR_REPORT_STREAMS } from "../simulatorReportStreams";

const STREAM_ICONS = {
  financial: Coins,
  "success-story": BarChart3,
  esg: Leaf,
} as const;

const CAROUSEL_DATA = SIMULATOR_REPORT_STREAMS.map((stream) => ({
  capital: stream.chapter,
  title: stream.title,
  metric: stream.stat,
  subMetric: stream.statLabel,
  icon: STREAM_ICONS[stream.id],
  themeColor:
    stream.id === "financial"
      ? "text-amber-400"
      : stream.id === "success-story"
        ? "text-emerald-400"
        : "text-teal-400",
  accentHex: stream.color,
  details: stream.metrics,
  blueprint: `AR.2025/26 // ${stream.id.toUpperCase().replace("-", "_")}_SYNC`,
}));

export function DemoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const dragStartRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const [dragOffset, setDragOffset] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : CAROUSEL_DATA.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < CAROUSEL_DATA.length - 1 ? prev + 1 : 0));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = e.clientX;
    isDraggingRef.current = true;
    containerRef.current?.classList.add("cursor-grabbing");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - dragStartRef.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    containerRef.current?.classList.remove("cursor-grabbing");
    
    if (dragOffset > 90) {
      handlePrev();
    } else if (dragOffset < -90) {
      handleNext();
    }
    setDragOffset(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = e.touches[0].clientX;
    isDraggingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.touches[0].clientX - dragStartRef.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    
    if (dragOffset > 70) {
      handlePrev();
    } else if (dragOffset < -70) {
      handleNext();
    }
    setDragOffset(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center select-none py-10 relative overflow-visible h-auto max-w-5xl mx-auto">
      
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/20 via-transparent to-transparent -z-10 rounded-full blur-2xl max-w-lg mx-auto h-72"></div>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-3 text-[10px] font-mono uppercase tracking-widest text-[#C5A059]">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          Annual Report Data Carousel
        </div>
        <h3 className="text-2xl font-serif italic text-white leading-none">
          Financial · <span className="text-[#C5A059] not-italic font-bold">Success Story · ESG</span>
        </h3>
        <p className="text-[11px] text-zinc-500 font-sans mt-2 max-w-md mx-auto leading-relaxed">
          Swipe between audited report chapters 07, 08 and 09. All metrics sync with the home page annual report.
        </p>
      </div>

      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full overflow-visible flex items-center justify-center py-6 h-[440px] cursor-grab transition-all duration-300"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
        }}
        id="carousel-scene-root"
      >
        {CAROUSEL_DATA.map((item, index) => {
          let offset = index - activeIndex;
          
          if (offset < -CAROUSEL_DATA.length / 2) offset += CAROUSEL_DATA.length;
          if (offset > CAROUSEL_DATA.length / 2) offset -= CAROUSEL_DATA.length;

          const isCenter = index === activeIndex;
          let rotationY = offset * 25;
          let translateZ = isCenter ? 30 : -100;
          let translateX = offset * 220 + (dragOffset * 0.4);
          let opacity = isCenter ? 1 : Math.max(0.12, 0.7 - Math.abs(offset) * 0.35);
          let scale = isCenter ? 1.0 : 0.82;
          const isHidden = Math.abs(offset) > 1.8;

          if (isHidden) {
            opacity = 0;
            scale = 0.5;
          }

          const CardIcon = item.icon;

          return (
            <div
              key={index}
              onClick={() => {
                if (!isCenter) {
                  setActiveIndex(index);
                }
              }}
              className="absolute w-[310px] h-[380px] rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto filter z-20"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotationY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: isCenter ? 50 : 30 - Math.abs(offset),
                background: "rgba(10, 15, 20, 0.7)",
                backdropFilter: isCenter ? "blur(20px)" : "blur(8px)",
                border: isCenter 
                  ? `1px solid ${item.accentHex}44` 
                  : "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: isCenter 
                  ? `0 15px 40px -10px ${item.accentHex}1a, inset 0 0 20px rgba(255,255,255,0.02)` 
                  : "0 4px 15px -5px rgba(0,0,0,0.4)",
              }}
              id={`carousel-item-${index}`}
            >
              <div className="p-6 h-full flex flex-col justify-between relative overflow-hidden">
                
                <div className="absolute right-4 top-4 font-mono text-[7px] text-zinc-600 tracking-wider text-right">
                  {item.blueprint}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="text-[9px] font-mono tracking-widest uppercase font-bold px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${item.accentHex}1c`,
                        color: item.accentHex,
                      }}
                    >
                      {item.capital}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-600">
                      0{index + 1} / 0{CAROUSEL_DATA.length}
                    </span>
                  </div>

                  <h4 className="text-lg font-serif italic text-white leading-tight mt-1 mb-1">
                    {item.title}
                  </h4>
                </div>

                <div className="my-3 py-4 border-y border-white/5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl font-display font-medium text-white tracking-tight">
                      {item.metric}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-1 font-sans">
                      {item.subMetric}
                    </span>
                  </div>
                  
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      borderColor: `${item.accentHex}2b`,
                      background: `linear-gradient(135deg, ${item.accentHex}0c, transparent)`,
                    }}
                  >
                    <CardIcon className={`w-6 h-6 ${item.themeColor}`} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {item.details.map((detail, dIdx) => (
                    <div 
                      key={dIdx} 
                      className="flex items-center justify-between text-[11px] font-mono bg-zinc-950/40 p-1.5 rounded-lg border border-zinc-900/50"
                    >
                      <span className="text-zinc-500 truncate pr-2">{detail.label}</span>
                      <span className="text-zinc-300 font-bold shrink-0">{detail.value}</span>
                    </div>
                  ))}
                </div>

                {isCenter && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1.5 opacity-60 animate-pulse transition-colors"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${item.accentHex}, transparent)`
                    }}
                  ></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-8 relative z-30">
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 font-mono">
          {CAROUSEL_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeIndex 
                  ? "w-6 bg-[#C5A059]" 
                  : "w-1.5 bg-white/15 hover:bg-white/25"
              }`}
              title={`Jump to ${SIMULATOR_REPORT_STREAMS[idx].chapter}`}
            ></button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-95 cursor-pointer"
          aria-label="Next Slide"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
