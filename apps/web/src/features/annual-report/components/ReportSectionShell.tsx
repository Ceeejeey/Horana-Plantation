import React from "react";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface ReportSectionShellProps {
  id: string;
  chapter: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  align?: "left" | "center";
  showYearBadge?: boolean;
  /** hero: full viewport, tight bottom; flow: content height, sits flush after prior section */
  layout?: "default" | "hero" | "flow";
}

export function ReportSectionShell({
  id,
  chapter,
  title,
  subtitle,
  children,
  className = "",
  contentClassName = "",
  align = "left",
  showYearBadge = true,
  layout = "default",
}: ReportSectionShellProps) {
  const isCentered = align === "center";

  const layoutClasses = {
    default: "min-h-screen justify-center py-16 sm:py-24",
    hero: "min-h-screen justify-center pt-16 pb-4 sm:pt-24 sm:pb-6",
    flow: "min-h-0 justify-start pt-6 pb-16 sm:pt-8 sm:pb-20",
  }[layout];

  return (
    <section
      id={id}
      className={`relative flex flex-col scroll-mt-24 ${layoutClasses} ${
        isCentered ? "items-center" : ""
      } ${className}`}
    >
      {isCentered && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <div className="h-[min(70vw,520px)] w-[min(90vw,720px)] rounded-full bg-[#C5A059]/[0.04] blur-[100px]" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className={`relative z-10 w-full px-1 ${
          isCentered
            ? `mx-auto flex flex-col items-center text-center ${contentClassName || "max-w-5xl"}`
            : contentClassName || "max-w-4xl"
        }`}
      >
        <div
          className={`mb-4 flex items-center gap-4 ${isCentered ? "w-full justify-center" : ""}`}
        >
          {isCentered && (
            <span className="h-px w-10 sm:w-14 bg-gradient-to-r from-transparent to-[#C5A059]/80" />
          )}
          {!isCentered && <span className="h-px w-12 bg-[#C5A059]" />}
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-[#C5A059]">
            {chapter}
          </span>
          {isCentered && (
            <span className="h-px w-10 sm:w-14 bg-gradient-to-l from-transparent to-[#C5A059]/80" />
          )}
        </div>

        {title && (
          <h2
            className={`mb-3 font-serif text-3xl leading-tight text-white italic sm:text-5xl ${
              isCentered ? "max-w-3xl" : ""
            }`}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <p
            className={`mb-8 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base ${
              isCentered ? "mx-auto" : ""
            }`}
          >
            {subtitle}
          </p>
        )}

        {showYearBadge && (
          <div
            className={`mb-8 inline-flex items-center gap-2 rounded-full border border-[#C5A059]/25 bg-[#C5A059]/10 px-3 py-1 ${
              isCentered ? "mx-auto" : ""
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-[#C5A059]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059]">
              Annual Report 2025/26
            </span>
          </div>
        )}

        <div className={`w-full ${isCentered ? "flex flex-col items-center" : ""}`}>
          {children}
        </div>
      </motion.div>
    </section>
  );
}
