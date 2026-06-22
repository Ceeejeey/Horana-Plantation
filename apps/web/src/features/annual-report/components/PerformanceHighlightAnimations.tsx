import { useEffect, useRef, useState } from "react";
import { animate, useInView, type Variants } from "motion/react";

function parseNumericValue(value: string): number {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? num : 0;
}

function formatAnimatedValue(num: number, original: string): string {
  const hasComma = original.includes(",");
  const decimalPart = original.split(".")[1];
  const decimals = decimalPart ? decimalPart.replace(/[^\d]/g, "").length : 0;

  if (decimals > 0) {
    return num.toFixed(decimals);
  }
  if (hasComma) {
    return Math.round(num).toLocaleString("en-LK");
  }
  return Math.round(num).toString();
}

interface AnimatedHighlightValueProps {
  value: string;
  className?: string;
  delay?: number;
  duration?: number;
}

export function AnimatedHighlightValue({
  value,
  className = "",
  delay = 0,
  duration = 1.35,
}: AnimatedHighlightValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const [display, setDisplay] = useState("0");
  const target = parseNumericValue(value);

  useEffect(() => {
    if (!isInView) return;

    setDisplay("0");
    const controls = animate(0, target, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(formatAnimatedValue(v, value)),
    });

    return () => controls.stop();
  }, [isInView, target, value, delay, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

interface AnimatedChangePercentProps {
  change: string;
  className?: string;
  delay?: number;
}

export function AnimatedChangePercent({
  change,
  className = "",
  delay = 0.4,
}: AnimatedChangePercentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const [display, setDisplay] = useState("0%");

  useEffect(() => {
    if (!isInView) return;

    const isNegative = change.includes("-") || change.startsWith("−");
    const numeric = parseNumericValue(change);
    const prefix = isNegative ? "−" : "+";

    setDisplay(`${prefix}0%`);
    const controls = animate(0, numeric, {
      duration: 1,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(1)}%`),
    });

    return () => controls.stop();
  }, [isInView, change, delay]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

export const performanceCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.82,
    filter: "blur(10px)",
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.75,
      delay: index * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export const performanceContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

export const performanceBannerVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};
