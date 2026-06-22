import { useRef, useState } from "react";
import { motion, useInView, type Variants } from "motion/react";
import { Award, Download, FileText, Pause, Quote, ShieldCheck, Volume2 } from "lucide-react";
import { PDFViewerModal } from "../../../components/common/PDFViewerModal";
import { ANNUAL_REPORT_PDF_URL, type LeaderProfile } from "../reportMockData";
import { useLeadershipNarration } from "../hooks/useLeadershipNarration";

type LeadershipVariant = "gold" | "emerald";

interface LeadershipCardProps {
  id: string;
  leader: LeaderProfile;
  variant: LeadershipVariant;
  index: number;
}

const cardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    y: 32,
    x: i === 0 ? -16 : 16,
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const THEME: Record<
  LeadershipVariant,
  {
    border: string;
    borderHover: string;
    glow: string;
    ring: string;
    quoteAccent: string;
    accent: string;
    accentLight: string;
    icon: typeof Award;
    bar: string;
  }
> = {
  gold: {
    border: "border-[#C5A059]/30",
    borderHover: "hover:border-[#C5A059]/50",
    glow: "bg-[#C5A059]/10",
    ring: "from-[#C5A059]/60 to-[#E5C079]/30",
    quoteAccent: "bg-[#C5A059]",
    accent: "#C5A059",
    accentLight: "#E5C079",
    icon: Award,
    bar: "bg-[#C5A059]",
  },
  emerald: {
    border: "border-emerald-500/25",
    borderHover: "hover:border-emerald-400/45",
    glow: "bg-emerald-500/8",
    ring: "from-emerald-400/50 to-teal-400/30",
    quoteAccent: "bg-emerald-400",
    accent: "#34D399",
    accentLight: "#6EE7B7",
    icon: ShieldCheck,
    bar: "bg-emerald-400",
  },
};

const VOICE_BARS = [0.45, 0.75, 0.55, 0.85, 0.6, 0.9, 0.5];

function VoiceBars({ barClass }: { barClass: string }) {
  return (
    <span className="inline-flex h-3.5 items-end gap-[2px]" aria-hidden>
      {VOICE_BARS.map((h, i) => (
        <motion.span
          key={i}
          className={`w-[2px] rounded-full ${barClass}`}
          animate={{
            height: [`${h * 10}px`, `${(1 - h * 0.3) * 14}px`, `${h * 11}px`],
            opacity: [0.45, 1, 0.5],
          }}
          transition={{
            duration: 0.5 + (i % 3) * 0.08,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
        />
      ))}
    </span>
  );
}

export function LeadershipCard({ id, leader, variant, index }: LeadershipCardProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const theme = THEME[variant];
  const BadgeIcon = theme.icon;
  const { playing, toggle } = useLeadershipNarration(leader.audioSrc);
  const [pdfOpen, setPdfOpen] = useState(false);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = ANNUAL_REPORT_PDF_URL;
    link.download = "Horana_AR_2025-26.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.article
      id={id}
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
      className={`group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-2xl border ${theme.border} ${theme.borderHover} bg-gradient-to-br from-[#0f1f18]/95 via-[#0a1610] to-[#050a07] shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-colors duration-400`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full ${theme.glow} blur-3xl opacity-70`}
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <div
              className={`absolute -inset-0.5 rounded-xl bg-gradient-to-br ${theme.ring} opacity-50`}
              aria-hidden
            />
            <img
              src={leader.image}
              alt={leader.name}
              loading="lazy"
              decoding="async"
              className="relative h-24 w-20 rounded-xl border border-white/10 object-cover object-top sm:h-28 sm:w-24"
            />
            <span
              className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-lg border border-[#0c1611]"
              style={{ backgroundColor: theme.accent }}
            >
              <BadgeIcon className="h-3 w-3 text-[#050b08]" />
            </span>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className="font-mono text-[9px] font-bold uppercase tracking-[0.25em]"
              style={{ color: theme.accentLight }}
            >
              {leader.role}
            </p>
            <h3 className="mt-1 font-serif text-lg leading-tight text-white sm:text-xl">
              {leader.name}
            </h3>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
              {leader.credentials}
            </p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative mt-5 flex gap-3 rounded-xl border border-white/[0.05] bg-[#050b08]/30 px-4 py-4 sm:mt-6 sm:px-5">
          <div className={`w-0.5 shrink-0 rounded-full ${theme.quoteAccent}`} aria-hidden />

          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center justify-between gap-3">
              <Quote className="h-4 w-4 opacity-25" style={{ color: theme.accent }} aria-hidden />
              <button
                type="button"
                onClick={toggle}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                style={{
                  borderColor: playing ? `${theme.accent}66` : `${theme.accent}40`,
                  color: theme.accentLight,
                  backgroundColor: playing ? `${theme.accent}18` : `${theme.accent}0c`,
                }}
              >
                {playing ? (
                  <>
                    <Pause className="h-3 w-3" />
                    Stop
                    <VoiceBars barClass={theme.bar} />
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3 w-3" />
                    Read
                  </>
                )}
              </button>
            </div>

            <blockquote className="font-serif text-sm italic leading-[1.8] text-zinc-300 sm:text-[15px]">
              &ldquo;{leader.quote}&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-4 flex items-center justify-end gap-3 sm:mt-5">
          <div className="text-right">
            <p className="font-serif text-base italic" style={{ color: theme.accentLight }}>
              {leader.signature}
            </p>
            <p className="mt-0.5 font-mono text-[8px] uppercase tracking-widest text-zinc-600">
              Authorized Signature
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 border-t border-white/[0.05] pt-4 sm:justify-start">
          <button
            type="button"
            onClick={() => setPdfOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-wider text-black cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}
          >
            <FileText className="h-3 w-3" />
            View PDF
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-wider cursor-pointer"
            style={{
              borderColor: `${theme.accent}44`,
              color: theme.accentLight,
            }}
          >
            <Download className="h-3 w-3" />
            Download
          </button>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-px"
        style={{ backgroundColor: theme.accent }}
        initial={{ width: "0%" }}
        animate={isInView ? { width: "100%" } : {}}
        transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      <PDFViewerModal
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        pdfUrl={ANNUAL_REPORT_PDF_URL}
        title={`${leader.pdfSection} — Annual Report 2025/26`}
      />
    </motion.article>
  );
}
