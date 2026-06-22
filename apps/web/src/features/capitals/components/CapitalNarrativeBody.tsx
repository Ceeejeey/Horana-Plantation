interface CapitalNarrativeBodyProps {
  paragraphs: string[];
  className?: string;
}

export function CapitalNarrativeBody({ paragraphs, className = "" }: CapitalNarrativeBodyProps) {
  const closingIndex = paragraphs.length - 1;

  return (
    <div className={`relative max-w-lg mb-8 ${className}`}>
      <div
        className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-[#C5A059]/5 via-[#C5A059]/35 to-[#C5A059]/5"
        aria-hidden
      />

      <div className="space-y-5 pl-5">
        {paragraphs.map((text, i) => {
          const isClosing = i === closingIndex && paragraphs.length > 1;

          return (
            <p
              key={i}
              className={
                isClosing
                  ? "text-sm sm:text-[15px] leading-[1.8] text-zinc-400 font-serif italic border-l border-[#C5A059]/15 pl-4 -ml-5"
                  : "text-sm sm:text-base leading-[1.8] text-zinc-300"
              }
            >
              {text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
