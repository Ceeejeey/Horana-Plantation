import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Sparkles, ShieldCheck, Award, Layers, HelpCircle, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Leader {
  name: string;
  role: string;
  credentials: string;
  quote: string;
  image: string;
  signature: string;
  capitalFocus: string;
}

const LEADERS: Leader[] = [
  {
    name: "A M PANDITHAGE",
    role: "Chairman — Executive Director",
    credentials: "Horana Plantations PLC",
    quote: "We recognise that long term value creation in plantations depends on the careful alignment of many moving parts; land, labour, capital, climate resilience, market access, community wellbeing and regulatory stability. In many ways, this reflects the logic of a Rubik's Cube, where each move affects the position and balance of the whole.",
    image: "/src/assets/images/chairman_portrait_1779635619055.png",
    signature: "A M Pandithage",
    capitalFocus: "Focus: Integrated Financial & Natural Equilibrium"
  },
  {
    name: "ROSHAN RAJADURAI",
    role: "Managing Director",
    credentials: "Horana Plantations PLC",
    quote: "We continued to advance the integrated approach through operational improvements, sustainability led initiatives, digital systems, diversification and people focused programmes. These priorities are aligned with the Hayleys Plantations ESG Framework \"Regenerate\".",
    image: "/src/assets/images/md_portrait_1779635639645.png",
    signature: "Roshan Rajadurai",
    capitalFocus: "Focus: Intellectual, Human & Manufactured Modernization"
  }
];

export function LeadershipInsights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const chairmanCardRef = useRef<HTMLDivElement>(null);
  const mdCardRef = useRef<HTMLDivElement>(null);
  const triggerTrackRef = useRef<HTMLDivElement>(null);
  
  // Track scroll stage state (0 = Chairman, 1 = Managing Director) to style secondary indicator dots React-side
  const [activeStage, setActiveStage] = useState<0 | 1>(0);

  useEffect(() => {
    const mainTrigger = triggerTrackRef.current;
    const pinElem = pinWrapperRef.current;
    const cardChairman = chairmanCardRef.current;
    const cardMd = mdCardRef.current;

    if (!mainTrigger || !pinElem || !cardChairman || !cardMd) return;

    // Use GSAP's responsive matchMedia to isolate pinned behavior to desktop
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop layout (1024px and greater): Pure Pinned Scroll-Scrub Magic!
      mm.add("(min-width: 1024px)", () => {
        // Set initial card coordinates
        gsap.set(cardChairman, { opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)", pointerEvents: "auto" });
        gsap.set(cardMd, { opacity: 0, scale: 0.88, y: 80, rotate: 4, filter: "blur(8px)", pointerEvents: "none" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: mainTrigger,
            pin: pinElem,
            start: "top top+=80px",
            end: "+=160%",
            scrub: 1.2,
            anticipatePin: 1,
            onUpdate: (self) => {
              const nextStage = self.progress < 0.5 ? 0 : 1;
              setActiveStage((prev) => {
                if (prev !== nextStage) {
                  return nextStage as 0 | 1;
                }
                return prev;
              });
            }
          }
        });

        // 1. Transition Chairman Card OUT of viewport focus (Progress range: 0.0 -> 0.45)
        tl.to(cardChairman, {
          opacity: 0,
          scale: 0.9,
          y: -80,
          rotate: -4,
          filter: "blur(10px)",
          pointerEvents: "none",
          duration: 1,
          force3D: true
        }, 0);

        // 2. Transition Managing Director Card IN (Progress range: 0.3 -> 0.85)
        tl.fromTo(cardMd, 
          {
            opacity: 0,
            scale: 0.9,
            y: 80,
            rotate: 4,
            filter: "blur(8px)",
            pointerEvents: "none"
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            filter: "blur(0px)",
            pointerEvents: "auto",
            duration: 1.2,
            force3D: true
          },
          0.3
        );

        // Pad timeline end to let Managing Director card stay pinned and easily legible
        tl.to({}, { duration: 0.5 });
      });

      // Tablet & Mobile layout (< 1024px): Responsive fade scroll triggers instead of heavy pinning
      mm.add("(max-width: 1023px)", () => {
        gsap.set(cardChairman, { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", pointerEvents: "auto" });
        gsap.set(cardMd, { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", pointerEvents: "auto" });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full overflow-visible select-none"
    >
      {/* Scroll trigger container tracking standard travel index */}
      <div 
        ref={triggerTrackRef}
        className="w-full lg:min-h-[220vh] h-auto flex flex-col justify-start relative overflow-visible"
      >
        {/* Pinned visual display wrapper */}
        <div 
          ref={pinWrapperRef}
          className="w-full h-auto lg:h-[95vh] flex flex-col justify-center relative py-6"
        >
          {/* Top Label & Strategic Header lines */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="h-[1.5px] w-8 bg-[#C5A059]"></span>
              <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] font-bold font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                Board of Directors | Executive Governance
              </span>
              <div className="h-[1px] flex-grow bg-white/5 border-dashed max-w-[120px]"></div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-[1.05] italic">
                  Governance & <br />
                  <span className="text-[#C5A059] not-italic">Systemic Leadership</span>
                </h2>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed max-w-md mt-3">
                  Our executive directorate aligns ecological responsibility with commercial performance, shaping systemic progress across all agrarian units.
                </p>
              </div>

              {/* High-end Timeline progress tracker (Desktop Pinned Feature Only) */}
              <div className="hidden lg:flex items-center gap-6 bg-[#040806]/90 border border-white/5 rounded-2xl p-3 pr-4 shadow-lg self-start">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">Scroll State:</span>
                  <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStage === 0 ? "bg-[#C5A059] scale-125 shadow-[0_0_8px_#C5A059]" : "bg-white/10"}`} />
                    <span className={`w-12 h-[1px] ${activeStage === 1 ? "bg-[#C5A059]" : "bg-white/10"} transition-colors duration-300`} />
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStage === 1 ? "bg-[#C5A059] scale-125 shadow-[0_0_8px_#C5A059]" : "bg-white/10"}`} />
                  </div>
                </div>

                <div className="text-[10px] font-mono tracking-wider font-semibold text-[#C5A059] uppercase">
                  {activeStage === 0 ? "01. Chairman Statement" : "02. Managing Director"}
                </div>
              </div>
            </div>
          </div>

          {/* Cards Frame (Absolute stack on Desktop, responsive vertical flow on Tablet/Mobile) */}
          <div className="relative w-full h-auto lg:h-[480px] flex flex-col gap-6 lg:block">
            
            {/* CARD 1: CHAIRMAN (Dilhan C. Fernando) */}
            <div 
              ref={chairmanCardRef}
              className="relative lg:absolute lg:inset-x-0 lg:top-0 w-full mb-6 lg:mb-0 bg-gradient-to-br from-[#0c1611]/98 to-[#040906]/98 border border-[#C5A059]/25 rounded-[32px] p-6 sm:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.06),0_0_40px_rgba(197,160,89,0.02)] transition-colors hover:border-[#C5A059]/40 duration-500 will-change-[transform,opacity] transform-gpu"
            >
              {/* Backglow accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A059]/5 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center relative z-10">
                {/* Elegant Portrait Frame */}
                <div className="relative shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-[#C5A059] to-emerald-500/30 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#050b08] border-2 border-[#09120d]">
                    <img
                      src={LEADERS[0].image}
                      alt={LEADERS[0].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale brightness-95 contrast-105 hover:grayscale-0 transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b08]/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#C5A059] text-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0c1611] shadow-lg">
                    <Award className="w-3.5 h-3.5 text-[#050b08]" />
                  </div>
                </div>

                {/* Profile content */}
                <div className="flex-grow text-center lg:text-left">
                  <Quote className="w-7 h-7 text-[#C5A059]/15 mb-2 -ml-2 select-none mx-auto lg:mx-0" />
                  <p className="text-zinc-200 font-serif italic text-sm sm:text-base leading-relaxed">
                    "{LEADERS[0].quote}"
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#C5A059] tracking-tight">
                        {LEADERS[0].name}
                      </h3>
                      <p className="text-[9.5px] font-mono tracking-widest text-[#C5A059]/75 font-semibold mt-0.5 uppercase">
                        {LEADERS[0].role}
                      </p>
                      <p className="text-[9px] font-mono text-zinc-500 lowercase mt-1 leading-none">
                        {LEADERS[0].credentials}
                      </p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end self-center sm:self-end">
                      <span className="font-serif italic text-[#C5A059]/80 text-lg tracking-tight leading-none opacity-90">
                        {LEADERS[0].signature}
                      </span>
                      <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A059]/50 to-transparent mt-1" />
                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                        Executive Stamp
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center lg:justify-start">
                    <div className="px-2.5 py-0.5 rounded bg-[#C5A059]/5 border border-[#C5A059]/15 text-[9px] font-mono text-[#C5A059]/90 tracking-wider uppercase font-semibold">
                      {LEADERS[0].capitalFocus}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: MD (Rohan Fernando) */}
            <div 
              ref={mdCardRef}
              className="relative lg:absolute lg:inset-x-0 lg:top-0 w-full mb-6 lg:mb-0 bg-gradient-to-br from-[#0c1611]/98 to-[#040906]/98 border border-emerald-500/25 rounded-[32px] p-6 sm:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.06),0_0_40px_rgba(16,185,129,0.02)] transition-colors hover:border-emerald-500/40 duration-500 will-change-[transform,opacity] transform-gpu"
            >
              {/* Backglow accent */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-3xl pointer-events-none rounded-full" />
              
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center relative z-10">
                {/* Elegant Portrait Frame */}
                <div className="relative shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-[#C5A059]/30 shadow-xl">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#050b08] border-2 border-[#09120d]">
                    <img
                      src={LEADERS[1].image}
                      alt={LEADERS[1].name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale brightness-95 contrast-105 hover:grayscale-0 transition-all duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050b08]/80 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0c1611] shadow-lg">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#050b08]" />
                  </div>
                </div>

                {/* Profile content */}
                <div className="flex-grow text-center lg:text-left">
                  <Quote className="w-7 h-7 text-emerald-500/15 mb-2 -ml-2 select-none mx-auto lg:mx-0" />
                  <p className="text-zinc-200 font-serif italic text-sm sm:text-base leading-relaxed">
                    "{LEADERS[1].quote}"
                  </p>

                  <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#C5A059] tracking-tight">
                        {LEADERS[1].name}
                      </h3>
                      <p className="text-[9.5px] font-mono tracking-widest text-[#C5A059]/75 font-semibold mt-0.5 uppercase">
                        {LEADERS[1].role}
                      </p>
                      <p className="text-[9px] font-mono text-zinc-500 lowercase mt-1 leading-none">
                        {LEADERS[1].credentials}
                      </p>
                    </div>

                    <div className="flex flex-col items-center sm:items-end self-center sm:self-end">
                      <span className="font-serif italic text-[#C5A059]/80 text-lg tracking-tight leading-none opacity-90">
                        {LEADERS[1].signature}
                      </span>
                      <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mt-1" />
                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest mt-1">
                        Executive Stamp
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-center lg:justify-start">
                    <div className="px-2.5 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/15 text-[9px] font-mono text-emerald-400 tracking-wider uppercase font-semibold">
                      {LEADERS[1].capitalFocus}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Prompt cue footer */}
          <div className="hidden lg:flex items-center gap-3 mt-6 animate-pulse text-[#C5A059]/40 text-xs font-mono justify-center lg:justify-start self-center">
            <span className="tracking-widest">SCROLL TO SWAP EXECUTIVE DOSSIERS</span>
            <div className="w-8 h-[1px] bg-[#C5A059]/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
