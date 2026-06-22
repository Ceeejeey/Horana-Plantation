import React, { useState } from "react";
import { Download, FileText, Volume2, Pause } from "lucide-react";
import { PDFViewerModal } from "../../../components/common/PDFViewerModal";
import { ANNUAL_REPORT_PDF_URL } from "../reportMockData";

interface ReportPdfActionsProps {
  title: string;
  sectionNote?: string;
  centered?: boolean;
}

export function ReportPdfActions({ title, sectionNote, centered }: ReportPdfActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = ANNUAL_REPORT_PDF_URL;
    link.download = "Horana_AR_2025-26.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className={`flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E5C079] text-black text-xs font-mono font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#C5A059]/20 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          View PDF
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#C5A059]/40 text-[#E5C079] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#C5A059]/10 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
      {sectionNote && (
        <p className={`mt-3 text-[10px] font-mono text-zinc-500 uppercase tracking-wider ${centered ? "text-center" : ""}`}>
          {sectionNote}
        </p>
      )}
      <PDFViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pdfUrl={ANNUAL_REPORT_PDF_URL}
        title={title}
      />
    </>
  );
}

interface VoiceQuotePlayerProps {
  label: string;
  quote: string;
  centered?: boolean;
}

export function VoiceQuotePlayer({ label, quote, centered }: VoiceQuotePlayerProps) {
  const [playing, setPlaying] = useState(false);

  const handleToggle = () => {
    if (playing) {
      window.speechSynthesis?.cancel();
      setPlaying(false);
      return;
    }

    if (!window.speechSynthesis) {
      alert("Voice playback is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(quote);
    utterance.rate = 0.92;
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  return (
    <div className="mt-6 rounded-xl border border-[#C5A059]/25 bg-[#0B2118]/60 p-4 backdrop-blur-sm">
      <div
        className={`flex gap-4 ${centered ? "flex-col items-center text-center" : "items-center justify-between"}`}
      >
        <div>
          <p className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] mb-1">
            Audio Narration
          </p>
          <p className="text-xs text-zinc-400">{label}</p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/35 text-[#E5C079] text-[10px] font-mono uppercase tracking-wider hover:bg-[#C5A059]/25 transition-all cursor-pointer"
        >
          {playing ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {playing ? "Pause" : "Play Quote"}
        </button>
      </div>
      {playing && (
        <div className={`mt-4 flex h-8 items-end gap-1 ${centered ? "justify-center" : ""}`}>
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-[#C5A059]/70 animate-pulse"
              style={{
                height: `${30 + ((i * 17) % 70)}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>
      )}
      <p className={`mt-3 text-[9px] font-mono text-zinc-600 ${centered ? "text-center" : ""}`}>
        Mock narration — final studio audio will replace this preview.
      </p>
    </div>
  );
}
