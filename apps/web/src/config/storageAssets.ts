import { getStorageAssetUrl } from "@/lib/storageUrl";

/** Firebase Storage URLs for files under `gs://…/assets/` (not bundled in Hosting). */
export const STORAGE_ASSETS = {
  images: {
    chairmanPortrait: getStorageAssetUrl(
      "images/chairman_portrait_1779635619055.png",
    ),
    mdPortrait: getStorageAssetUrl("images/md_portrait_1779635639645.png"),
  },
  coverPage: {
    cover: getStorageAssetUrl(
      "cover_page/HORANA Cover Story Image and MockUp_page-0001.jpg",
    ),
    thumb: getStorageAssetUrl(
      "cover_page/thumb/HORANA Cover Story thumb.webp",
    ),
  },
  businessModel: {
    layer1: getStorageAssetUrl("business model/1.png"),
    layer2: getStorageAssetUrl("business model/2.png"),
    layer3: getStorageAssetUrl("business model/3.png"),
    layer4: getStorageAssetUrl("business model/4.png"),
    layer5: getStorageAssetUrl("business model/5.png"),
  },
  cubeFaces: {
    front: getStorageAssetUrl("cube-faces/front.webp"),
    right: getStorageAssetUrl("cube-faces/right.webp"),
    top: getStorageAssetUrl("cube-faces/top.webp"),
    left: getStorageAssetUrl("cube-faces/left.webp"),
    bottom: getStorageAssetUrl("cube-faces/bottom.webp"),
    back: getStorageAssetUrl("cube-faces/back.webp"),
  },
  pdf: {
    annualReport: getStorageAssetUrl(
      "pdf/annual-report/Horana AR 2025-26.pdf",
    ),
    financial: getStorageAssetUrl("pdf/FINANCIAL CAPITAL.pdf"),
    manufactured: getStorageAssetUrl("pdf/MANUFACTURE CAPITAL.pdf"),
    intellectual: getStorageAssetUrl("pdf/INTERLECTUAL CAPITAL.pdf"),
    human: getStorageAssetUrl("pdf/HUMAN CAPITAL.pdf"),
    social: getStorageAssetUrl("pdf/SOCIAL & RELATIONSHIP CAPITAL.pdf"),
    natural: getStorageAssetUrl("pdf/NATURAL CAPITAL.pdf"),
  },
} as const;

export const ANNUAL_REPORT_PDF_URL = STORAGE_ASSETS.pdf.annualReport;
