import { STORAGE_ASSETS } from "@/config/storageAssets";

export interface CapitalPdfAsset {
  url: string;
  downloadName: string;
}

export const CAPITAL_PDF_BY_ID: Record<string, CapitalPdfAsset> = {
  financial: {
    url: STORAGE_ASSETS.pdf.financial,
    downloadName: "FINANCIAL_CAPITAL.pdf",
  },
  manufactured: {
    url: STORAGE_ASSETS.pdf.manufactured,
    downloadName: "MANUFACTURE_CAPITAL.pdf",
  },
  intellectual: {
    url: STORAGE_ASSETS.pdf.intellectual,
    downloadName: "INTERLECTUAL_CAPITAL.pdf",
  },
  human: {
    url: STORAGE_ASSETS.pdf.human,
    downloadName: "HUMAN_CAPITAL.pdf",
  },
  social: {
    url: STORAGE_ASSETS.pdf.social,
    downloadName: "SOCIAL_RELATIONSHIP_CAPITAL.pdf",
  },
  natural: {
    url: STORAGE_ASSETS.pdf.natural,
    downloadName: "NATURAL_CAPITAL.pdf",
  },
};
