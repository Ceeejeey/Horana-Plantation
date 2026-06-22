import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { STORAGE_ASSETS } from "@/config/storageAssets";

const BUSINESS_MODEL_LAYERS = [
  STORAGE_ASSETS.businessModel.layer1,
  STORAGE_ASSETS.businessModel.layer2,
  STORAGE_ASSETS.businessModel.layer3,
  STORAGE_ASSETS.businessModel.layer4,
  STORAGE_ASSETS.businessModel.layer5,
] as const;

/**
 * Layer sizes as % of the diagram container (easy to tweak).
 * 1 = largest outer ring · 5 = smallest center (governance cube)
 */
export const BUSINESS_MODEL_SIZES = {
  /** Max width of the whole diagram (px) */
  containerMaxPx: 580,
  /** Each layer: width & height % of container */
  layers: {
    1: 100,
    2: 93,
    3: 72,
    4: 59,
    5: 48,
  },
} as const;

interface LayerConfig {
  id: 1 | 2 | 3 | 4 | 5;
  src: string;
  alt: string;
  rotate: boolean;
  direction: "cw" | "ccw";
  duration: number;
  zIndex: number;
}

const LAYERS: LayerConfig[] = [
  {
    id: 1,
    src: BUSINESS_MODEL_LAYERS[0],
    alt: "Value generation — outer activities ring",
    rotate: true,
    direction: "cw",
    duration: 110,
    zIndex: 1,
  },
  {
    id: 2,
    src: BUSINESS_MODEL_LAYERS[1],
    alt: "Value generation — operational practices ring",
    rotate: true,
    direction: "ccw",
    duration: 95,
    zIndex: 2,
  },
  {
    id: 3,
    src: BUSINESS_MODEL_LAYERS[2],
    alt: "Value generation — cultivation and manufacturing ring",
    rotate: true,
    direction: "cw",
    duration: 80,
    zIndex: 3,
  },
  {
    id: 4,
    src: BUSINESS_MODEL_LAYERS[3],
    alt: "Value generation — governance framework ring",
    rotate: true,
    direction: "ccw",
    duration: 70,
    zIndex: 4,
  },
  {
    id: 5,
    src: BUSINESS_MODEL_LAYERS[4],
    alt: "Governance — central cube",
    rotate: false,
    direction: "cw",
    duration: 0,
    zIndex: 5,
  },
];

interface BusinessModelDiagramProps {
  className?: string;
  /** Override container max width (px) */
  containerMaxPx?: number;
  /** Override per-layer size % — e.g. `{ 5: 28 }` */
  layerSizes?: Partial<typeof BUSINESS_MODEL_SIZES.layers>;
}

export function BusinessModelDiagram({
  className = "",
  containerMaxPx = BUSINESS_MODEL_SIZES.containerMaxPx,
  layerSizes,
}: BusinessModelDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const sizes = { ...BUSINESS_MODEL_SIZES.layers, ...layerSizes };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className={`mx-auto w-full ${className}`}
      style={{ maxWidth: `min(94vw, ${containerMaxPx}px)` }}
    >
      <p className="mb-3 text-center font-mono text-[9px] font-bold uppercase tracking-[0.32em] text-[#C5A059]">
        Governance Core
      </p>

      <div
        className="relative mx-auto aspect-square w-full"
        style={{ maxHeight: `min(94vw, ${containerMaxPx}px)` }}
      >
        {LAYERS.map((layer) => {
          const sizePct = sizes[layer.id];

          return (
            <div
              key={layer.id}
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{
                zIndex: layer.zIndex,
                width: `${sizePct}%`,
                height: `${sizePct}%`,
              }}
            >
              <motion.img
                src={layer.src}
                alt={layer.alt}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full select-none object-contain drop-shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
                style={{ transformOrigin: "center center" }}
                animate={
                  layer.rotate && isInView
                    ? { rotate: layer.direction === "cw" ? 360 : -360 }
                    : { rotate: 0 }
                }
                transition={
                  layer.rotate
                    ? {
                        duration: layer.duration,
                        repeat: Infinity,
                        ease: "linear",
                      }
                    : undefined
                }
              />
            </div>
          );
        })}

        <div
          className="pointer-events-none absolute inset-0 rounded-full border border-[#C5A059]/10"
          aria-hidden
        />
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500">
          Layer 4 · Governance framework
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          {[
            { n: 3, label: "Cultivation" },
            { n: 2, label: "Operations" },
            { n: 1, label: "Outcomes" },
          ].map(({ n, label }) => (
            <span
              key={n}
              className="rounded-full border border-white/10 bg-[#0B2118]/60 px-3 py-1 font-mono text-[8px] uppercase tracking-wider text-zinc-400"
            >
              {n} · {label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
