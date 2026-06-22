import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import { PDFViewerModal } from "../../../components/common/PDFViewerModal";
import { CAPITAL_PDF_BY_ID } from "../capitalPdfAssets";

interface CapitalPdfActionsProps {
  capitalId: string;
}

function formatCapitalTitle(capitalId: string): string {
  return `${capitalId.charAt(0).toUpperCase()}${capitalId.slice(1)} Capital`;
}

export function CapitalPdfActions({ capitalId }: CapitalPdfActionsProps) {
  const asset = CAPITAL_PDF_BY_ID[capitalId];
  const [isOpen, setIsOpen] = useState(false);

  if (!asset) return null;

  const title = `${formatCapitalTitle(capitalId)} — Annual Report 2025/26`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = asset.url;
    link.download = asset.downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
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

      <PDFViewerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        pdfUrl={asset.url}
        title={title}
      />
    </>
  );
}
