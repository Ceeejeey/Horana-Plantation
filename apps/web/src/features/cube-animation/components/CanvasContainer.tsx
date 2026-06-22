import React, { useState } from "react";
import { CubeBlock } from "./CubeBlock";
import { useCubeScrollAnimation } from "../hooks/useCubeScrollAnimation";
import { Sparkles, Milestone, Play, Download, Eye } from "lucide-react";
import { useActiveSection } from "../../../context/ActiveSectionContext";
import { CubeGameModal } from "../../../components/common/CubeGameModal";
import { PDFReportModal } from "../../../components/common/PDFReportModal";
import { jsPDF } from "jspdf";

export const CanvasContainer = React.memo(function CanvasContainer() {
  const { rotateX, rotateY, rotateZ, layers, isSolved } = useCubeScrollAnimation();
  const { activeSectionIndex, scrollProgress } = useActiveSection();
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [isHUDDownloading, setIsHUDDownloading] = useState(false);

  // Standard cubie sizes matching responsive grid scaling
  const cubieSize = 70; // 70px per cubie
  const gap = 3;       // 3px spacing

  // Generate coordinates for the 26 outer cubies of a 3x3x3 Rubik's cube
  const cubieCoordinates: { x: number; y: number; z: number }[] = [];
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Skip the hidden inner core (0,0,0)
        if (x === 0 && y === 0 && z === 0) continue;
        cubieCoordinates.push({ x, y, z });
      }
    }
  }

  const handleHUDDownloadPDF = () => {
    setIsHUDDownloading(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Page 1: Brand Cover Setup
      doc.setFillColor(11, 33, 24); // #0B2118 Deep Teal
      doc.rect(0, 0, 16, pageHeight, "F");
      
      doc.setFillColor(197, 160, 89); // #C5A059 Gold Spacer
      doc.rect(16, 0, 1.5, pageHeight, "F");

      doc.setTextColor(11, 33, 24);
      doc.setFont("serif", "bold");
      doc.setFontSize(26);
      doc.text("HORANA PLANTATIONS PLC", 25, 45);
      
      doc.setFont("sans", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("A MEMBER OF HAYLEYS GROUP", 25, 52);

      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.8);
      doc.line(25, 58, 120, 58);

      doc.setFont("serif", "normal");
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Integrated Capitals Performance Report", 25, 70);

      doc.setFont("sans", "bold");
      doc.setFontSize(13);
      doc.setTextColor(16, 185, 129);
      doc.text("SYSTÈMIC ALIGNMENT & AGRO-BALANCED METRICS", 25, 78);

      doc.setFont("sans", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(120, 120, 120);
      doc.text("Date Generated:", 25, 96);
      doc.setFont("sans", "bold");
      doc.text(new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }), 62, 96);
      
      doc.setFont("sans", "normal");
      doc.text("Document Standard:", 25, 102);
      doc.setFont("sans", "bold");
      doc.text("Rainforest Alliance Alignment Code V4", 62, 102);

      doc.setFont("sans", "normal");
      doc.text("Audit Registry ID:", 25, 108);
      doc.setFont("mono", "normal");
      doc.text("HPPLC-903-ALIGN-2026", 62, 108);

      doc.setFont("serif", "italic");
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      const textIntro = "At Horana Plantations PLC, agricultural progress is measured not as a single stream but as a balanced system of variables. This documentation traces our progress across the six capital assets required to balance agribusiness outcomes with ecological and community stewardship.";
      const splitIntro = doc.splitTextToSize(textIntro, pageWidth - 50);
      doc.text(splitIntro, 25, 122);

      doc.setFillColor(242, 246, 244);
      doc.rect(25, 155, pageWidth - 45, 38, "F");
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.2);
      doc.rect(25, 155, pageWidth - 45, 38, "D");

      doc.setFont("sans", "bold");
      doc.setFontSize(10);
      doc.setTextColor(11, 33, 24);
      doc.text("VALIDATED COMPLIANCE STANDARDS", 30, 163);

      doc.setFont("sans", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(60, 60, 60);
      doc.text("* Rainforest Alliance Estate Sourcing Certificate - Grade A", 30, 171);
      doc.text("* ISO 14001:2015 Environmental Systems Standards Assured", 30, 177);
      doc.text("* Fairtrade Premium Direct Estate Sourced - Registered Trade Index", 30, 183);
      doc.text("* Ethical Tea Sourcing Partnership Standard Compliance V2", 30, 189);

      doc.setFont("serif", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 33, 24);
      doc.line(25, 248, 85, 248);
      doc.text("Executive Green Audit Panel", 25, 253);
      doc.setFont("sans", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text("Hayleys Agribusiness Compliance Officer", 25, 258);

      doc.setFont("serif", "bold");
      doc.setFontSize(11);
      doc.setTextColor(11, 33, 24);
      doc.line(130, 248, 190, 248);
      doc.text("Horana Board of Directors", 130, 253);
      doc.setFont("sans", "normal");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text("Certified Estate Auditor Signature", 130, 258);

      doc.setFont("sans", "normal");
      doc.setFontSize(7.5);
      doc.text("Horana Plantations PLC  |  2026 Corporate Capitals Review", 25, 282);
      doc.text("Page 1 of 2", pageWidth - 40, 282);

      // Page 2 Setup
      doc.addPage();
      doc.setFillColor(11, 33, 24);
      doc.rect(0, 0, pageWidth, 24, "F");
      doc.setFillColor(197, 160, 89);
      doc.rect(0, 24, pageWidth, 1.2, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("serif", "bold");
      doc.setFontSize(14);
      doc.text("HORANA PLANTATIONS PLC", 15, 14);

      doc.setFont("sans", "normal");
      doc.setFontSize(9);
      doc.setTextColor(197, 160, 89);
      doc.text("THE SIX INTERACTIVE CAPITAL SHIFT MATRICES", 15, 19);

      const capitalsData = [
        {
          tag: "FIN",
          title: "Financial Capital",
          metric: "LKR 4.2 Billion Revenue",
          trend: "+12.4% YoY Growth",
          summary: "Robust capital deployment across estates with prime tea harvest yields and strong premium crepe latex rubber pricing index.",
          v1: "Net Profit Margin: 14.8%",
          v2: "Capital Expenditure: LKR 380M",
          v3: "Export Ratio: 88%"
        },
        {
          tag: "MFG",
          title: "Manufactured Capital",
          metric: "18 Processing Factories",
          trend: "Fully Operational",
          summary: "Modernized estate processing centers equipped with precision drying beds, high-efficiency rubber rollers, and solar energy arrays.",
          v1: "Solar Self-Sufficiency: 62%",
          v2: "Machinery Downtime: 1.2%",
          v3: "Annual Capacity: 12,500 MT"
        },
        {
          tag: "INT",
          title: "Intellectual Capital",
          metric: "RFID Weighing & Telemetry",
          trend: "Telemetry Active",
          summary: "Implementation of satellite soil monitoring, automated digital weighing grids, and drone-assisted nitrogen crop sprays.",
          v1: "Drone Mapping Info: 94%",
          v2: "Prediction Precision: 97.3%",
          v3: "R&D Spend: LKR 45 Million"
        },
        {
          tag: "HUM",
          title: "Human Capital",
          metric: "14,200 Welfare Workers",
          trend: "0 Safety Incidents",
          summary: "Comprehensive healthcare cover, vocational upgrades, estate child development centers, and structured safety frameworks.",
          v1: "Training Hours: 32 Hrs/Yr",
          v2: "Employee Retention: 91%",
          v3: "Welfare Trust: LKR 112M"
        },
        {
          tag: "SOC",
          title: "Social Capital",
          metric: "2,500+ Buyout Partners",
          trend: "98% Trust Score",
          summary: "Sustaining local community structures with clean water access, educational scholarships, and supportive agricultural buyout models.",
          v1: "Schools Maintained: 12",
          v2: "Buyout Funds: LKR 150M",
          v3: "Estates Impacted: 45"
        },
        {
          tag: "NAT",
          title: "Natural Capital",
          metric: "Rainforest Alliance Sourced",
          trend: "Carbon-Neutral",
          summary: "Organic composting initiatives, biological pest controls, spring water source protection corridors, and dynamic reforestation.",
          v1: "Conservation: 1,200 Ha",
          v2: "Bio-fertilisers: +30%",
          v3: "Soil Carbon Score: 3.4%"
        }
      ];

      let currentY = 38;
      capitalsData.forEach((cap) => {
        doc.setFillColor(248, 250, 249);
        doc.rect(15, currentY, pageWidth - 30, 32, "F");
        doc.setDrawColor(215, 225, 220);
        doc.setLineWidth(0.15);
        doc.rect(15, currentY, pageWidth - 30, 32, "D");

        doc.setFillColor(11, 33, 24);
        doc.rect(15, currentY, 2.5, 32, "F");

        doc.setFont("sans", "bold");
        doc.setFontSize(11);
        doc.setTextColor(11, 33, 24);
        doc.text(`[${cap.tag}] ${cap.title}`, 22, currentY + 6);

        doc.setFont("sans", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(197, 160, 89);
        doc.text(cap.metric, pageWidth - 100, currentY + 6);

        doc.setFont("sans", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(16, 185, 129);
        doc.text(cap.trend, pageWidth - 45, currentY + 6);

        doc.setFont("serif", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const splitSum = doc.splitTextToSize(cap.summary, pageWidth - 40);
        doc.text(splitSum, 22, currentY + 12);

        doc.setFont("sans", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 120);
        
        doc.text(cap.v1, 22, currentY + 26);
        doc.text(cap.v2, 80, currentY + 26);
        doc.text(cap.v3, 140, currentY + 26);

        currentY += 37;
      });

      doc.setFont("sans", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text("Horana Plantations PLC  |  Confidential Strategic Report", 15, 282);
      doc.text("Page 2 of 2", pageWidth - 30, 282);

      doc.save("Horana_Plantations_PLC_Consolidated_Capitals_2026.pdf");
    } finally {
      setIsHUDDownloading(false);
    }
  };

  return (
    <>
      <div 
        className="w-full h-full flex flex-col items-center justify-center relative overflow-visible pointer-events-none group"
        id="active-cube-trigger-container"
      >
        
        {/* Decorative architectural grid background behind the cube */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 select-none opacity-40">
          <div className="w-[300px] h-[300px] rounded-full border border-emerald-500/10 border-dashed animate-spin" style={{ animationDuration: "60s" }}></div>
          <div className="w-[450px] h-[450px] rounded-full border border-amber-400/5 absolute border-dashed animate-spin" style={{ animationDuration: "100s", animationDirection: "reverse" }}></div>
        </div>

        {/* Primary 3D Perspective Stage - Clickable Zone */}
        <div 
          className="relative w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] flex items-center justify-center select-none scale-75 xs:scale-80 sm:scale-90 md:scale-[0.95] lg:scale-105 xl:scale-120 transition-all duration-500 pointer-events-auto cursor-pointer group-hover:opacity-100 group-hover:scale-[1.03] active:scale-95"
          onClick={() => setIsGameModalOpen(true)}
          id="active-cube-trigger"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Interactive Floating 3D Cube Assembly */}
          <div
            className="w-full h-full relative flex items-center justify-center"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
            }}
          >
            {cubieCoordinates.map((coord, idx) => (
              <CubeBlock
                key={`${coord.x}-${coord.y}-${coord.z}-${idx}`}
                cx={coord.x}
                cy={coord.y}
                cz={coord.z}
                layers={layers}
                cubieSize={cubieSize}
                gap={gap}
                activeSectionIndex={activeSectionIndex}
                scrollProgress={scrollProgress}
              />
            ))}
          </div>
        </div>

        {/* Floating Circular Play Overlay (renders exactly centered over 3D cube bounds) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 ease-out flex flex-col items-center gap-2 bg-[#030704]/90 p-3 pb-2.5 rounded-2xl border border-[#C5A059]/40 pointer-events-auto cursor-pointer shadow-[0_20px_40px_rgba(0,0,0,0.95)]" onClick={() => setIsGameModalOpen(true)}>
            <div className="w-12 h-12 rounded-full bg-[#C5A059] hover:bg-[#b59048] flex items-center justify-center text-black shadow-lg relative transition-all duration-300">
              <Play className="w-5 h-5 fill-current ml-1 text-black" />
              <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#C5A059]/40 animate-spin" style={{ animationDuration: "12s" }}></div>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-[#C5A059] font-bold uppercase whitespace-nowrap bg-black/40 px-2 py-0.5 rounded">
              Interactive Sandbox
            </span>
          </div>
        </div>

        {/* Floating Reflective Floor Blur Accent */}
        <div className="absolute bottom-4 w-48 h-4 bg-emerald-950/20 blur-xl rounded-full scale-150 transform transition-all duration-700 opacity-60"></div>

        {/* Status HUD Buttons overlay below the cube instead of old static label */}
        <div 
          className="absolute bottom-6 sm:bottom-10 lg:bottom-12 flex flex-col sm:flex-row items-center gap-3 select-none pointer-events-auto z-20"
        >
          {/* Download PDF button with beautiful micro glow and pulse */}
          <button 
            onClick={handleHUDDownloadPDF}
            disabled={isHUDDownloading}
            className="group/btn relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A059]/10 to-[#E5C079]/15 hover:from-[#C5A059]/20 hover:to-[#E5C079]/25 border border-[#C5A059]/35 hover:border-[#C5A059]/80 shadow-[0_4px_15px_rgba(197,160,89,0.12)] hover:shadow-[0_4px_25px_rgba(197,160,89,0.3)] backdrop-blur-md text-[10px] font-mono font-bold uppercase text-[#C5A059] cursor-pointer transition-all active:scale-95 duration-300"
          >
            {/* Shimmer line movement effect */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] translate-x-[-150%] group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            
            {isHUDDownloading ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#C5A059]/30 border-t-[#C5A059] animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 animate-bounce group-hover/btn:text-white transition-colors" />
            )}
            <span>{isHUDDownloading ? "Downloading..." : "PDF Download"}</span>
          </button>

          {/* View Report interactive reader button */}
          <button 
            onClick={() => setIsPDFModalOpen(true)}
            className="group/view flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950/90 hover:bg-neutral-900 border border-emerald-500/30 hover:border-emerald-500/70 shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-md text-[10px] font-mono font-bold uppercase text-emerald-400 hover:text-emerald-300 cursor-pointer transition-all active:scale-95 duration-300"
          >
            <Eye className="w-3.5 h-3.5 group-hover/view:rotate-[8deg] transition-transform" />
            <span>View Capitals Report</span>
          </button>
        </div>

      </div>

      {/* Play Game Modal container overlay popup */}
      <CubeGameModal isOpen={isGameModalOpen} onClose={() => setIsGameModalOpen(false)} />

      {/* PDF Report modal popup */}
      <PDFReportModal isOpen={isPDFModalOpen} onClose={() => setIsPDFModalOpen(false)} />
    </>
  );
});
