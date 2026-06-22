import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, FileText, Download, Eye, Sparkles, Building2, Leaf, 
  HeartHandshake, Cpu, Landmark, Users, CheckCircle2, TrendingUp, AlertCircle
} from "lucide-react";
import { jsPDF } from "jspdf";

interface PDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PDFReportModal: React.FC<PDFReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const capitalsData = [
    {
      id: "financial",
      title: "Financial Capital",
      icon: Landmark,
      color: "#EF4444",
      tag: "FIN",
      metric: "LKR 4.2 Billion Revenue",
      trend: "+12.4% YoY Growth",
      summary: "Robust capital deployment across estates with prime tea harvest yields and strong premium crepe latex rubber pricing index.",
      details: [
        { label: "Net Profit Margin", value: "14.8%" },
        { label: "Capital Expenditure", value: "LKR 380 Million" },
        { label: "Export Ratio", value: "88% Global Markets" }
      ]
    },
    {
      id: "manufactured",
      title: "Manufactured Capital",
      icon: Building2,
      color: "#71717A",
      tag: "MFG",
      metric: "18 Processing Factories",
      trend: "Fully Operational",
      summary: "Modernized estate processing centers equipped with precision drying beds, high-efficiency rubber rollers, and solar energy arrays.",
      details: [
        { label: "Factory Power Self-Sufficiency", value: "62% Solar Powered" },
        { label: "Machinery Downtime Ratio", value: "1.2%" },
        { label: "Annual Processing Capacity", value: "12,500 Metric Tons" }
      ]
    },
    {
      id: "intellectual",
      title: "Intellectual Capital",
      icon: Cpu,
      color: "#06B6D4",
      tag: "INT",
      metric: "RFID Weighing & Telemetry",
      trend: "Precision Agronomy Active",
      summary: "Implementation of satellite soil monitoring, automated digital weighing grids, and drone-assisted nitrogen crop sprays.",
      details: [
        { label: "Drone Mapping Coverage", value: "94% of Total Acreage" },
        { label: "Yield Prediction Precision", value: "97.3% Accuracy" },
        { label: "R&D Spend allocation", value: "LKR 45 Million" }
      ]
    },
    {
      id: "human",
      title: "Human Capital",
      icon: Users,
      color: "#F97316",
      tag: "HUM",
      metric: "14,200 Welfare-Backed Workers",
      trend: "0 Critical Safety Incidents",
      summary: "Comprehensive healthcare cover, vocational upgrades, estate child development centers, and structured safety frameworks.",
      details: [
        { label: "Training Hours per Capita", value: "32 Hours/Year" },
        { label: "Employee Retention Index", value: "91%" },
        { label: "Welfare Trust Allocation", value: "LKR 112 Million" }
      ]
    },
    {
      id: "social",
      title: "Social Capital",
      icon: HeartHandshake,
      color: "#4F46E5",
      tag: "SOC",
      metric: "2,500+ Smallholder Partners",
      trend: "98% Trust Score",
      summary: "Sustaining local community structures with clean water access, educational scholarships, and supportive agricultural buyout models.",
      details: [
        { label: "Local Schools Maintained", value: "12 Educational Centers" },
        { label: "Smallholder Buyout Funds", value: "LKR 150 Million" },
        { label: "Community Support Projects", value: "45 Estates Impacted" }
      ]
    },
    {
      id: "natural",
      title: "Natural Capital",
      icon: Leaf,
      color: "#10B981",
      tag: "NAT",
      metric: "Rainforest Alliance Sourced",
      trend: "Carbon-Neutral Tea Tier",
      summary: "Organic composting initiatives, biological pest controls, spring water source protection corridors, and dynamic reforestation.",
      details: [
        { label: "Forested Conservation Buffer", value: "1,200 Hectares" },
        { label: "Composting Level Increase", value: "+30% Bio-fertilisers" },
        { label: "Soil Carbon Density Score", value: "3.4%" }
      ]
    }
  ];

  const downloadPDFReport = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Page parameters
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Page 1: Beautiful Executive Cover
      // Corporate Solid Background Left Border Highlight
      doc.setFillColor(11, 33, 24); // #0B2118 Deep Teal Guard
      doc.rect(0, 0, 16, pageHeight, "F");
      
      doc.setFillColor(197, 160, 89); // #C5A059 Gold Spacer
      doc.rect(16, 0, 1.5, pageHeight, "F");

      // Title & Header section
      doc.setTextColor(11, 33, 24);
      doc.setFont("serif", "bold");
      doc.setFontSize(26);
      doc.text("HORANA PLANTATIONS PLC", 25, 45);
      
      doc.setFont("sans", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text("A MEMBER OF HAYLEYS GROUP", 25, 52);

      // Gold Accent Horizontal rule
      doc.setDrawColor(197, 160, 89);
      doc.setLineWidth(0.8);
      doc.line(25, 58, 120, 58);

      // Document Title
      doc.setFont("serif", "normal");
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      doc.text("Integrated Capitals Performance Report", 25, 70);

      doc.setFont("sans", "bold");
      doc.setFontSize(13);
      doc.setTextColor(16, 185, 129); // Emerald 500
      doc.text("SYSTÈMIC ALIGNMENT & AGRO-BALANCED METRICS", 25, 78);

      // Audit info
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

      // Brief introductory summary statement
      doc.setFont("serif", "italic");
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      const textIntro = "At Horana Plantations PLC, agricultural progress is measured not as a single stream but as a balanced system of variables. This documentation traces our progress across the six capital assets required to balance agribusiness outcomes with ecological and community stewardship.";
      const splitIntro = doc.splitTextToSize(textIntro, pageWidth - 50);
      doc.text(splitIntro, 25, 122);

      // Certification Table / Badges
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

      // Bottom Signature block
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

      // Page footer (Cover page)
      doc.setFont("sans", "normal");
      doc.setFontSize(7.5);
      doc.text("Horana Plantations PLC  |  2026 Corporate Capitals Review", 25, 282);
      doc.text("Page 1 of 2", pageWidth - 40, 282);

      // ---- Page 2: Detailed Capital Matrices ----
      doc.addPage();
      
      // Page 2 header
      doc.setFillColor(11, 33, 24);
      doc.rect(0, 0, pageWidth, 24, "F");
      
      // Gold line under header
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

      // Render all capitals
      let currentY = 38;
      capitalsData.forEach((cap) => {
        // Draw Accent block representing cap color
        doc.setFillColor(248, 250, 249);
        doc.rect(15, currentY, pageWidth - 30, 32, "F");
        doc.setDrawColor(215, 225, 220);
        doc.setLineWidth(0.15);
        doc.rect(15, currentY, pageWidth - 30, 32, "D");

        // Small bar highlight
        doc.setFillColor(11, 33, 24);
        doc.rect(15, currentY, 2.5, 32, "F");

        // Name
        doc.setFont("sans", "bold");
        doc.setFontSize(11);
        doc.setTextColor(11, 33, 24);
        doc.text(`[${cap.tag}] ${cap.title}`, 22, currentY + 6);

        // Highlight Metric tag
        doc.setFont("sans", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(197, 160, 89);
        doc.text(cap.metric, pageWidth - 100, currentY + 6);

        // Trend
        doc.setFont("sans", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(16, 185, 129);
        doc.text(cap.trend, pageWidth - 45, currentY + 6);

        // Summary text
        doc.setFont("serif", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const splitSum = doc.splitTextToSize(cap.summary, pageWidth - 40);
        doc.text(splitSum, 22, currentY + 12);

        // Grid for details
        doc.setFont("sans", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(120, 120, 120);
        
        // Item 1
        doc.text(`${cap.details[0].label}:`, 22, currentY + 26);
        doc.setTextColor(11, 33, 24);
        doc.text(cap.details[0].value, 60, currentY + 26);
        doc.setTextColor(120, 120, 120);

        // Item 2
        doc.text(`${cap.details[1].label}:`, 80, currentY + 26);
        doc.setTextColor(11, 33, 24);
        doc.text(cap.details[1].value, 125, currentY + 26);
        doc.setTextColor(120, 120, 120);

        // Item 3
        doc.text(`${cap.details[2].label}:`, 140, currentY + 26);
        doc.setTextColor(11, 33, 24);
        doc.text(cap.details[2].value, 178, currentY + 26);

        currentY += 37;
      });

      // Page 2 Footer
      doc.setFont("sans", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text("Horana Plantations PLC  |  Confidential Strategic Report", 15, 282);
      doc.text("Page 2 of 2", pageWidth - 30, 282);

      // Save the PDF
      doc.save("Horana_Plantations_PLC_Consolidated_Capitals_2026.pdf");
    } finally {
      setIsGenerating(false);
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div key="pdf-modal-wrapper" className="fixed inset-0 z-[99999] flex items-center justify-center p-0 md:p-6 overflow-hidden">
          
          {/* Backdrop blur overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#020704]/96 backdrop-blur-md cursor-zoom-out"
          />

          {/* Modal Paper Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full h-full md:max-w-5xl md:h-[90vh] bg-neutral-900 border-0 md:border border-[#C5A059]/30 rounded-none md:rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.98)] overflow-hidden flex flex-col pointer-events-auto"
          >
            {/* Top Corporate Status Header */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-[#C5A059] to-emerald-500" />
            
            {/* Header Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-[#C5A059]/15 select-none shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/35 flex items-center justify-center text-[#C5A059]">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-semibold font-serif text-white tracking-widest uppercase">
                      HORANA PLANTATIONS PLC
                    </h3>
                    <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                      Audited
                    </span>
                  </div>
                  <p className="text-[9.5px] font-mono text-zinc-500 tracking-wider">
                    INTEGRATED CAPITALS REPORT 2026/2027
                  </p>
                </div>
              </div>

              {/* Close and Download actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPDFReport}
                  disabled={isGenerating}
                  className="px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#b08b47] hover:to-[#C5A059] text-black uppercase transition-all duration-300 shadow-[0_10px_20px_rgba(197,160,89,0.15)] active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <div className="w-3.5 h-3.5 rounded-full border border-black/30 border-t-black animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isGenerating ? "Assembling PDF..." : "Download Report"}</span>
                </button>

                <button 
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors border border-transparent hover:border-zinc-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Interactive Reader Area */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0A110D]">
              
              {/* Left Selector Drawer (Deskop) */}
              <div className="w-full md:w-[280px] bg-neutral-950 border-r border-[#C5A059]/15 flex flex-col p-4 shrink-0 overflow-y-auto">
                <span className="text-[8.5px] font-mono tracking-widest text-[#C5A059] block font-black uppercase mb-3">
                  Report Indexes
                </span>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-sans transition-all flex items-center justify-between cursor-pointer ${
                      activeTab === "all" 
                        ? "bg-[#C5A059]/15 text-[#C5A059] font-semibold border-l-2 border-[#C5A059]" 
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-neutral-900 border-l-2 border-transparent"
                    }`}
                  >
                    <span>Overview Statement</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]/60" />
                  </button>

                  <div className="h-px bg-[#C5A059]/10 my-3" />

                  {capitalsData.map((cap) => {
                    const CapIcon = cap.icon;
                    return (
                      <button
                        key={cap.id}
                        onClick={() => setActiveTab(cap.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-sans transition-all flex items-center gap-2.5 cursor-pointer ${
                          activeTab === cap.id 
                            ? "bg-neutral-900 text-white font-medium border-l-2" 
                            : "text-zinc-400 hover:text-zinc-200 hover:bg-neutral-900 border-l-2 border-transparent"
                        }`}
                        style={{ borderLeftColor: activeTab === cap.id ? cap.color : "transparent" }}
                      >
                        <CapIcon className="w-3.5 h-3.5 shrink-0" style={{ color: cap.color }} />
                        <span className="truncate">{cap.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sri Lanka certifications HUD Footer */}
                <div className="mt-8 pt-4 border-t border-[#C5A059]/10 space-y-3">
                  <span className="text-[8.5px] font-mono text-[#C5A059] uppercase block font-bold">
                    Official Audit Panel
                  </span>
                  <div className="space-y-1.5 text-[10px] text-zinc-500 leading-normal">
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>Rainforest Certified</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>ISO 14001 Compliant</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>Fairtrade Premium Co.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Render Document Viewport */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-gradient-to-b from-[#0A110D] via-neutral-900 to-neutral-950">
                
                {activeTab === "all" ? (
                  /* Consolidated Report Master View */
                  <div className="space-y-6">
                    <div className="bg-[#0b1612] border border-[#C5A059]/25 p-6 rounded-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 blur-2xl rounded-full" />
                      <div className="flex items-center gap-2 mb-3 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                        <span>Executive Statement</span>
                      </div>
                      <h2 className="text-2xl font-serif text-white font-medium leading-snug">
                        Striving for Complete <span className="text-[#C5A059] italic">Enterprise Balance</span>
                      </h2>
                      <p className="text-xs text-zinc-400 leading-relaxed mt-3 font-serif max-w-3xl">
                        At Horana Plantations PLC, agricultural progress is measured not as a single metric, but as an intertwined system. Each turn of our progress must support the ecological diversity of our hills, the financial safety of our corporate assets, the health of our farmers, and the intellectual strength of precision agronomy.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {capitalsData.map((cap) => {
                        const CapIcon = cap.icon;
                        return (
                          <div 
                            key={cap.id} 
                            onClick={() => setActiveTab(cap.id)}
                            className="bg-neutral-900/60 border border-zinc-800 hover:border-[#C5A059]/30 p-4.5 rounded-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:translate-y-[-1px] group"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-black/40 border border-white/5 group-hover:border-[#C5A059]/20 transition-colors">
                                  <CapIcon className="w-4 h-4" style={{ color: cap.color }} />
                                </div>
                                <div>
                                  <span className="text-[8px] font-mono tracking-widest text-[#C5A059] uppercase block font-black">
                                    {cap.tag} CAPITAL
                                  </span>
                                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide group-hover:text-white transition-colors">
                                    {cap.title}
                                  </h4>
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-500 font-bold group-hover:text-[#C5A059] transition-colors">
                                View Details &rarr;
                              </span>
                            </div>
                            <p className="text-[10.5px] text-zinc-400 line-clamp-2 leading-relaxed mt-3 font-serif">
                              {cap.summary}
                            </p>
                            <div className="mt-4 pt-3 border-t border-zinc-800/55 flex justify-between items-center text-[10px]">
                              <span className="text-emerald-400 font-mono font-bold">{cap.metric}</span>
                              <span className="text-zinc-500 font-sans">{cap.trend}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Single Capital Focused View */
                  (() => {
                    const selectedCap = capitalsData.find(c => c.id === activeTab);
                    if (!selectedCap) return null;
                    const CapIcon = selectedCap.icon;

                    return (
                      <div className="space-y-6">
                        {/* Header Banner */}
                        <div className="bg-[#0b1612] border border-[#C5A059]/25 p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-[#C5A059]/25 flex items-center justify-center">
                              <CapIcon className="w-6 h-6" style={{ color: selectedCap.color }} />
                            </div>
                            <div>
                              <span className="text-[9px] font-mono tracking-widest text-[#C5A059] uppercase block font-black leading-none mb-1">
                                {selectedCap.tag} CATEGORY AUDIT
                              </span>
                              <h2 className="text-xl font-serif text-white font-bold uppercase tracking-wide">
                                {selectedCap.title}
                              </h2>
                            </div>
                          </div>
                          
                          <div className="flex flex-row md:flex-col items-baseline md:items-end justify-between md:justify-center border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
                            <span className="text-lg font-bold text-emerald-400 font-mono leading-none md:mb-1">
                              {selectedCap.metric}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded">
                              {selectedCap.trend}
                            </span>
                          </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          
                          {/* Strategic narrative card */}
                          <div className="md:col-span-2 bg-neutral-900/40 border border-zinc-800 p-5 rounded-xl space-y-4">
                            <h3 className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-widest border-b border-zinc-800 pb-2">
                              Strategic Directive & Focus
                            </h3>
                            <p className="text-sm font-serif text-zinc-300 leading-relaxed">
                              {selectedCap.summary}
                            </p>
                            <div className="flex items-start gap-2 text-xs text-zinc-500 bg-neutral-950/40 p-3.5 rounded-lg border border-zinc-800">
                              <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                              <p className="leading-relaxed font-sans text-[11px]">
                                This metric was verified by environmental models, tracking biomass balances, carbon dioxide absorption rates, and estate worker wellness indexes.
                              </p>
                            </div>
                          </div>

                          {/* Stat items list */}
                          <div className="bg-neutral-900/40 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
                            <div>
                              <h3 className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-widest border-b border-zinc-800 pb-2">
                                Performance Index
                              </h3>
                              <div className="divide-y divide-zinc-800/60 mt-2">
                                {selectedCap.details.map((det, index) => (
                                  <div key={index} className="py-2.5 flex items-center justify-between text-xs">
                                    <span className="text-zinc-400 font-sans">{det.label}</span>
                                    <span className="text-zinc-100 font-mono font-bold text-right">{det.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => setActiveTab("all")}
                              className="mt-6 w-full py-2 bg-neutral-950 hover:bg-neutral-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-colors active:scale-[0.98] cursor-pointer"
                            >
                              &larr; Overview Tab
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })()
                )}

              </div>
            </div>

            {/* Bottom corporate footnote banner */}
            <div className="px-6 py-3 bg-neutral-950 border-t border-zinc-800/40 text-[9.5px] font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 select-none text-center sm:text-left shrink-0">
              <span>HPPLC REGISTRY OF DISCLOSURES &copy; 2026. STABILITY ASSURED BY PRECISION METRICS.</span>
              <span className="text-[#C5A059] font-bold">Rainforest Alliance Assured Grade-A</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
