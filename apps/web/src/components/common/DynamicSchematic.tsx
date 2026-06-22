import React, { useEffect, useState } from "react";

interface DynamicSchematicProps {
  id: string;
  isActive: boolean;
}

export function DynamicSchematic({ id, isActive }: DynamicSchematicProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isActive) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }
  }, [isActive]);

  const dashOffsetClass = animate ? "animate-draw-line" : "";

  // Render highly-detailed professional technical drawing schemas mapped by capital theme
  const renderSVGPaths = () => {
    switch (id) {
      case "financial":
        return (
          <g stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.32" className="text-amber-500/80">
            {/* Fine trend lines with structural data grids */}
            <path 
              d="M 20 180 L 100 130 L 180 150 L 260 70 L 340 100 L 420 30" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "1000",
                strokeDashoffset: animate ? "0" : "1000",
                transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            {/* Secondary backing forecast line */}
            <path 
              d="M 20 160 Q 150 160 260 100 T 420 50" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "1000",
                strokeDashoffset: animate ? "0" : "1000",
                transition: "stroke-dashoffset 2.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              strokeDasharray="4 4"
            />
            {/* Grid circles */}
            <circle cx="100" cy="130" r="3.5" fill="#EAB308" className="animate-ping" style={{ animationDuration: "3s" }} />
            <circle cx="260" cy="70" r="3.5" fill="#EAB308" />
            <circle cx="420" cy="30" r="4.5" fill="#EAB308" />
            
            {/* Axis guides and ticks */}
            <line x1="20" y1="190" x2="440" y2="190" strokeDasharray="5 5" />
            <line x1="20" y1="20" x2="20" y2="190" strokeDasharray="5 5" />
          </g>
        );

      case "manufactured":
        return (
          <g stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.28" className="text-teal-500/80">
            {/* Cyber physical smart factory network array */}
            <circle 
              cx="120" cy="100" r="45" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "300",
                strokeDashoffset: animate ? "0" : "300",
                transition: "stroke-dashoffset 1.8s ease-in-out",
              }}
            />
            <circle cx="120" cy="100" r="28" strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: "10s" }} />
            
            {/* Outer grid connections */}
            <path 
              d="M 120 20 L 120 55 M 120 145 L 120 180 M 45 100 L 75 100 M 165 100 L 320 100" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "500",
                strokeDashoffset: animate ? "0" : "500",
                transition: "stroke-dashoffset 2s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            {/* Secondary node network */}
            <circle cx="320" cy="100" r="14" />
            <path d="M 320 100 L 380 40 M 320 100 L 380 160" strokeDasharray="4 4" />
            <circle cx="380" cy="40" r="6" fill="#14B8A6" />
            <circle cx="380" cy="160" r="6" fill="#14B8A6" />
          </g>
        );

      case "intellectual":
        return (
          <g stroke="currentColor" strokeWidth="1.1" fill="none" opacity="0.3" className="text-cyan-500/80">
            {/* Neural crop hybridization artificial networks */}
            <path 
              d="M 40 100 Q 140 30 240 100 T 440 100" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "600",
                strokeDashoffset: animate ? "0" : "600",
                transition: "stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            <path 
              d="M 40 100 Q 140 170 240 100 T 440 100" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "600",
                strokeDashoffset: animate ? "0" : "600",
                transition: "stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            {/* Synthetic nodes & vertical bridging lines */}
            <line x1="140" y1="52" x2="140" y2="148" strokeDasharray="3 3" />
            <line x1="240" y1="100" x2="240" y2="180" />
            <line x1="340" y1="52" x2="340" y2="148" strokeDasharray="3 3" />

            <circle cx="140" cy="52" r="5" fill="#06B6D4" />
            <circle cx="140" cy="148" r="5" fill="#06B6D4" />
            <circle cx="240" cy="100" r="7" fill="#06B6D4" />
            <circle cx="340" cy="52" r="5" fill="#06B6D4" />
            <circle cx="340" cy="148" r="5" fill="#06B6D4" />
          </g>
        );

      case "human":
        return (
          <g stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.25" className="text-indigo-400">
            {/* ILO Standards biological wellness rings and telemetry grids */}
            <circle 
              cx="240" cy="100" r="60" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "400",
                strokeDashoffset: animate ? "0" : "400",
                transition: "stroke-dashoffset 2s ease-in-out",
              }}
            />
            <circle 
              cx="240" cy="100" r="45" strokeDasharray="5 5" 
              className="animate-spin" style={{ animationDuration: "14s" }} 
            />
            {/* Medical / ergonomic crosses representing wellbeing safeguards */}
            <path d="M 230 100 L 250 100 M 240 90 L 240 110" strokeWidth="2.5" />
            <circle cx="90" cy="100" r="12" />
            <circle cx="390" cy="100" r="12" />
            {/* Wave signals spanning out */}
            <path d="M 102 100 L 180 100 M 300 100 L 378 100" strokeDasharray="6 3" />
          </g>
        );

      case "social":
        return (
          <g stroke="currentColor" strokeWidth="1.1" fill="none" opacity="0.32" className="text-sky-500/80">
            {/* Connected Village Co-op hex matrices */}
            <path 
              d="M 100 50 L 160 50 L 190 100 L 160 150 L 100 150 L 70 100 Z" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "600",
                strokeDashoffset: animate ? "0" : "600",
                transition: "stroke-dashoffset 2s cubic-bezier(0.25, 0.8, 0.25, 1)",
              }}
            />
            <path 
              d="M 230 50 L 290 50 L 320 100 L 290 150 L 230 150 L 200 100 Z" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "600",
                strokeDashoffset: animate ? "0" : "600",
                transition: "stroke-dashoffset 2.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
              }}
            />
            {/* Connection points */}
            <line x1="190" y1="100" x2="200" y2="100" strokeWidth="2" strokeDasharray="3 2" className="animate-pulse" />
            <circle cx="100" cy="50" r="4" fill="#38BDF8" />
            <circle cx="160" cy="150" r="4" fill="#38BDF8" />
            <circle cx="230" cy="150" r="4" fill="#38BDF8" />
            <circle cx="290" cy="50" r="4" fill="#38BDF8" />
          </g>
        );

      case "natural":
      default:
        return (
          <g stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.3" className="text-emerald-500/80">
            {/* Rainforest organic leaf structure merged with solar coordinates */}
            <path 
              d="M 50 150 Q 150 20 250 150" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "600",
                strokeDashoffset: animate ? "0" : "600",
                transition: "stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            <path 
              d="M 250 150 Q 350 20 450 150" 
              className={`transition-all duration-1000 ease-in-out ${dashOffsetClass}`}
              style={{
                strokeDasharray: "600",
                strokeDashoffset: animate ? "0" : "600",
                transition: "stroke-dashoffset 2.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
            {/* Center stem lines */}
            <line x1="50" y1="150" x2="450" y2="150" />
            
            {/* Radiant solar ripples */}
            <circle cx="250" cy="50" r="20" strokeDasharray="4 4" className="animate-pulse" />
            <circle cx="250" cy="50" r="32" strokeDasharray="6 6" />
            <circle cx="250" cy="50" r="3" fill="#10B981" />
          </g>
        );
    }
  };

  return (
    <div 
      className="absolute right-0 bottom-4 w-[280px] h-[160px] md:w-[460px] md:h-[200px] pointer-events-none select-none -z-10 opacity-70"
      id={`structural-schematic-${id}`}
    >
      <svg 
        viewBox="0 0 460 200" 
        className="w-full h-full text-current filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
        preserveAspectRatio="xMidYMid meet"
      >
        {renderSVGPaths()}
      </svg>
    </div>
  );
}
