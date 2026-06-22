import { useCallback, useState } from "react";
import type { PointerEvent } from "react";
import { Download, FileText } from "lucide-react";
import { BookCover3D } from "./BookCover3D";
import { PDFViewerModal } from "./PDFViewerModal";
import annualReportPdf from "../../assets/pdf/annual-report/Horana AR 2025-26.pdf";

interface AnnualReportBookBlockProps {
  className?: string;
  showExternalActions?: boolean;
  variant?: "default" | "hero";
}

export function AnnualReportBookBlock({
  className = "",
  showExternalActions = true,
  variant = "default",
}: AnnualReportBookBlockProps) {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      setParallax({
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      });
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = annualReportPdf;
    link.download = "Horana_AR_2025-26.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isHero = variant === "hero";

  return (
    <div
      className={`flex flex-col items-center overflow-visible ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <BookCover3D parallax={parallax} />

      {showExternalActions && (
        <div
          className={
            isHero
              ? "book-action-dock mt-1 w-full max-w-[360px] px-2"
              : "mt-2 flex flex-wrap items-center justify-center gap-3 w-full max-w-[360px] px-2"
          }
        >
          <button
            type="button"
            onClick={() => setIsViewerOpen(true)}
            className={
              isHero
                ? "book-action-btn book-action-btn--primary"
                : "inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#E5C079] text-black text-xs font-mono font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-[#C5A059]/25 transition-all cursor-pointer"
            }
          >
            <FileText className="w-4 h-4 shrink-0" />
            View PDF
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className={
              isHero
                ? "book-action-btn book-action-btn--ghost"
                : "inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 px-5 py-3 rounded-lg border border-[#C5A059]/40 text-[#E5C079] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#C5A059]/10 transition-all cursor-pointer"
            }
          >
            <Download className="w-4 h-4 shrink-0" />
            Download
          </button>
        </div>
      )}

      <PDFViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        pdfUrl={annualReportPdf}
        title="Horana Plantations — Annual Report 2025/26"
      />

      {isHero && <style>{heroActionStyles}</style>}
    </div>
  );
}

const heroActionStyles = `
  .book-action-dock {
    display: flex;
    gap: 0.625rem;
    padding: 0;
    border: none;
    background: transparent;
    backdrop-filter: none;
    box-shadow: none;
  }
  .book-action-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-height: 2.75rem;
    padding: 0.625rem 1rem;
    border-radius: 0.75rem;
    font-family: ui-monospace, monospace;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
  }
  .book-action-btn:hover {
    transform: translateY(-1px);
  }
  .book-action-btn:active {
    transform: translateY(0);
  }
  .book-action-btn--primary {
    color: #0a140f;
    background: linear-gradient(135deg, #C5A059 0%, #E5C079 55%, #d4ad65 100%);
    box-shadow: 0 8px 24px rgba(197,160,89,0.28);
  }
  .book-action-btn--primary:hover {
    box-shadow: 0 12px 28px rgba(197,160,89,0.38);
  }
  .book-action-btn--ghost {
    color: #E5C079;
    border: 1px solid rgba(197,160,89,0.35);
    background: rgba(197,160,89,0.06);
  }
  .book-action-btn--ghost:hover {
    background: rgba(197,160,89,0.14);
    border-color: rgba(197,160,89,0.5);
  }
`;
