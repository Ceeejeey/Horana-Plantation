import React from "react";
import { CAPITALS_DATA } from "../capitalsData";
import { useActiveSection } from "../../../context/ActiveSectionContext";
import { Check, Compass, Info, ShieldCheck, Sparkles, Building2, Eye, Award, HelpCircle } from "lucide-react";
import { KineticText } from "../../../components/common/KineticText";
import { CapitalNarrativeBody } from "./CapitalNarrativeBody";
import { DynamicSchematic } from "../../../components/common/DynamicSchematic";

export function CapitalSection() {
  const { activeSectionIndex } = useActiveSection();

  return (
    <div className="w-full relative select-none selection:bg-[#C5A059]/20">
      
      {/* SECTION 0: LANDING HERO */}
      <section 
        className="w-full min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 relative"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="max-w-xl md:max-w-2xl relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[10px] font-mono tracking-widest text-[#C5A059] font-bold uppercase">
              Alignment & Complexity Solved
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif text-white tracking-tight leading-[1.0] italic">
            <KineticText text="Designing Systemic" type="reveal" as="span" /> <br />
            <span className="text-[#C5A059] font-serif not-italic">
              <KineticText text="Alignment" type="reveal" as="span" />
            </span> & <KineticText text="Balance." type="reveal" as="span" />
          </h2>

          <p className="mt-6 text-zinc-300 font-sans text-sm sm:text-base leading-relaxed max-w-lg">
            At Horana Plantations PLC, our agricultural network is a complex, multi-dimensional system of dynamic components. Each turn of our progress must be perfectly aligned across all six capitals.
          </p>

          <p className="mt-4 text-zinc-400 font-sans text-xs sm:text-sm leading-relaxed max-w-lg italic">
            Scroll down to rotate the 3D Rubik's Cube dashboard. Witness how each programmatic rotation brings structure, harmony, and total alignment to our plantations.
          </p>

          {/* Prompt cues */}
          <div className="mt-10 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[#C5A059]/60 text-xs font-mono">
              <div className="w-8 h-[1px] bg-[#C5A059]"></div>
              <span className="tracking-widest">SCROLL DOWN TO ROTATE MODEL</span>
            </div>
            {/* Scroll Bounce indicator */}
            <div className="w-6 h-10 border border-[#C5A059]/30 rounded-full p-1 flex justify-center mt-2 opacity-60">
              <div className="w-1.5 h-3 bg-[#C5A059] rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS 1 to 6: THE 6 CAPITALS */}
      {CAPITALS_DATA.map((capital) => {
        const isCurrent = activeSectionIndex === capital.index;

        return (
          <section
            key={capital.id}
            id={capital.id}
            className={`w-full min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 relative transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isCurrent 
                ? "opacity-100 scale-100 translate-y-0 filter-none z-20 pointer-events-auto" 
                : "opacity-0 md:opacity-5 scale-95 translate-y-8 pointer-events-none filter blur-sm -z-10"
            }`}
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="max-w-6xl mx-auto w-full relative z-20">
              
              {/* Massive Parallax Background Watermark */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[15vw] font-serif font-black tracking-tighter text-white/[0.015] select-none pointer-events-none uppercase transition-all duration-700 leading-none">
                {capital.id}
              </div>

              {/* Dynamic Luxury Technical Drawings Animation */}
              <DynamicSchematic id={capital.id} isActive={isCurrent} />

              {/* Capital narrative & SDG alignment */}
              <div className="flex flex-col justify-center relative z-20 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#05070B]/40 via-[#05070B]/75 to-[#05070B]/90 backdrop-blur-[20px] border border-white/5 lg:bg-none lg:backdrop-blur-none lg:border-none shadow-2xl lg:shadow-none max-w-3xl">
                {/* Vertical indexing line */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="h-[1px] w-12 bg-[#C5A059]"></span>
                  <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold font-mono">
                    0{capital.index} / 06 Capital Series
                  </span>
                  <div className="h-[1px] flex-grow bg-white/5 border-dashed max-w-[80px]"></div>
                </div>

                {/* Capital Header */}
                <h1 className="text-5xl sm:text-7xl font-serif italic leading-[0.95] mb-6 text-white capitalize overflow-visible">
                  <KineticText text={capital.id} type="reveal" as="span" /> <br />
                  <span className="text-[#C5A059] not-italic">
                    <KineticText text="Capital" type="reveal" as="span" />
                  </span>
                </h1>

                {/* Slogan Quote Panel (Word-by-word scroll highlighting) */}
                <div className="mb-6 max-w-md">
                  <KineticText 
                    text={`“${capital.title}”`} 
                    type="highlight" 
                    as="p" 
                    className="text-xl sm:text-2xl font-serif leading-relaxed italic" 
                  />
                </div>

                <p className="text-xs sm:text-sm font-serif text-[#E5C079]/90 mb-8 max-w-md leading-relaxed tracking-wide">
                  {capital.concept}
                </p>

                <CapitalNarrativeBody paragraphs={capital.body} />
              </div>

            </div>
          </section>
        );
      })}

      {/* SECTION 7: FINAL ALIGNMENT & CONCLUSION */}
      <section 
        className="w-full min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 relative"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="max-w-xl md:max-w-2xl relative z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span className="text-[10.5px] font-mono tracking-widest text-[#C5A059] font-bold uppercase">
              Total Connection Solved
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-serif font-medium text-white tracking-tight leading-[1.0] italic">
            <KineticText text="Complex Systems in" type="reveal" as="span" /> <br />
            <span className="text-[#C5A059] font-serif not-italic">
              <KineticText text="Absolute Coherence." type="reveal" as="span" />
            </span>
          </h2>

          <p className="mt-6 text-zinc-300 font-sans text-sm leading-relaxed max-w-lg">
            Every layer has finished its rotation. Every connection is secured. Witness the 3D Cube solved and in perfect harmony, symbolizing the total alignment of our estates across Sri Lanka.
          </p>

          <p className="mt-4 text-zinc-400 font-sans text-xs leading-relaxed max-w-lg italic">
            This operational integrity guarantees that the Horana Plantations model remains sustainable, competitive, and adaptable to global climate and market trends.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 pt-4 border-t border-white/5 max-w-lg">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-[#C5A059]/20">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Audited Matrix</span>
                <span className="text-xs font-sans font-bold text-zinc-300 mt-1">ISO 14001 Compliant</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-[#C5A059]/20">
              <Award className="w-4 h-4 text-[#C5A059]" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Sustainability Rank</span>
                <span className="text-xs font-sans font-bold text-[#C5A059] mt-1">Rainforest Alliance Platinum</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
