import capital1 from "@/assets/6 capital/1.png";
import capital2 from "@/assets/6 capital/2.png";
import capital3 from "@/assets/6 capital/3.png";
import capital4 from "@/assets/6 capital/4.png";
import capital5 from "@/assets/6 capital/5.png";
import capital6 from "@/assets/6 capital/6.png";
import { CAPITALS_DATA } from "./capitalsData";

/** Local carousel art — `1.png` … `6.png` align with capital index (1–6). */
const CAPITAL_CAROUSEL_LOCAL_IMAGES = [
  capital1,
  capital2,
  capital3,
  capital4,
  capital5,
  capital6,
] as const;

/** Per-capital accent for carousel frame (matches capitalsData themes). */
export const CAPITAL_CAROUSEL_THEME: Record<
  string,
  { border: string; glow: string; label: string }
> = {
  financial: {
    border: "border-amber-400/45",
    glow: "shadow-[0_0_32px_rgba(251,191,36,0.22)]",
    label: "text-amber-300",
  },
  manufactured: {
    border: "border-teal-400/45",
    glow: "shadow-[0_0_32px_rgba(45,212,191,0.22)]",
    label: "text-teal-300",
  },
  intellectual: {
    border: "border-cyan-400/45",
    glow: "shadow-[0_0_32px_rgba(34,211,238,0.22)]",
    label: "text-cyan-300",
  },
  human: {
    border: "border-indigo-400/45",
    glow: "shadow-[0_0_32px_rgba(129,140,248,0.22)]",
    label: "text-indigo-300",
  },
  social: {
    border: "border-sky-400/45",
    glow: "shadow-[0_0_32px_rgba(56,189,248,0.22)]",
    label: "text-sky-300",
  },
  natural: {
    border: "border-emerald-400/45",
    glow: "shadow-[0_0_32px_rgba(52,211,153,0.22)]",
    label: "text-emerald-300",
  },
};

export function getCapitalCarouselImage(capitalIndex: number): string {
  const src = CAPITAL_CAROUSEL_LOCAL_IMAGES[capitalIndex - 1];
  return src ?? CAPITAL_CAROUSEL_LOCAL_IMAGES[0];
}

export function getCapitalCarouselTheme(capitalId: string) {
  return (
    CAPITAL_CAROUSEL_THEME[capitalId] ?? CAPITAL_CAROUSEL_THEME.financial
  );
}

/** Ordered list aligned with CAPITALS_DATA (6 items). */
export const CAPITAL_CAROUSEL_MOCKS = CAPITALS_DATA.map((capital) => ({
  id: capital.id,
  index: capital.index,
  title: capital.title,
  label: `${capital.id} capital`,
  src: getCapitalCarouselImage(capital.index),
  theme: getCapitalCarouselTheme(capital.id),
}));
