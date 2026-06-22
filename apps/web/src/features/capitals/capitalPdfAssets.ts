import financialPdf from "../../assets/pdf/FINANCIAL CAPITAL.pdf";
import manufacturedPdf from "../../assets/pdf/MANUFACTURE CAPITAL.pdf";
import intellectualPdf from "../../assets/pdf/INTERLECTUAL CAPITAL.pdf";
import humanPdf from "../../assets/pdf/HUMAN CAPITAL.pdf";
import socialPdf from "../../assets/pdf/SOCIAL & RELATIONSHIP CAPITAL.pdf";
import naturalPdf from "../../assets/pdf/NATURAL CAPITAL.pdf";

export interface CapitalPdfAsset {
  url: string;
  downloadName: string;
}

export const CAPITAL_PDF_BY_ID: Record<string, CapitalPdfAsset> = {
  financial: { url: financialPdf, downloadName: "FINANCIAL_CAPITAL.pdf" },
  manufactured: { url: manufacturedPdf, downloadName: "MANUFACTURE_CAPITAL.pdf" },
  intellectual: { url: intellectualPdf, downloadName: "INTERLECTUAL_CAPITAL.pdf" },
  human: { url: humanPdf, downloadName: "HUMAN_CAPITAL.pdf" },
  social: { url: socialPdf, downloadName: "SOCIAL_RELATIONSHIP_CAPITAL.pdf" },
  natural: { url: naturalPdf, downloadName: "NATURAL_CAPITAL.pdf" },
};
