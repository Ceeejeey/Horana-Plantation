import React, { useState, useEffect, useCallback, useRef } from "react";
import type { PointerEvent } from "react";
import { CAPITALS_DATA } from "../capitalsData";
import { useActiveSection } from "../../../context/ActiveSectionContext";
import { Sparkles, ShieldCheck, Award } from "lucide-react";
import { KineticText } from "../../../components/common/KineticText";
import { TextRevealCard } from "../components/TextRevealCard";
import { CapitalNarrativeBody } from "../components/CapitalNarrativeBody";
import { DynamicSchematic } from "../../../components/common/DynamicSchematic";
import { CanvasContainer } from "../../cube-animation/components/CanvasContainer";
import { CapitalCubeCarousel } from "../components/CapitalCubeCarousel";
import { LeadershipInsights } from "../components/LeadershipInsights";
import { CapitalPdfActions } from "../components/CapitalPdfActions";

interface ChapterIntro {
  chapter: string;
  title: string;
  subtitle?: string;
}

interface CapitalsSplitViewProps {
  variant?: "full" | "chapter";
  chapterIntro?: ChapterIntro;
}

export function CapitalsSplitView({ variant = "full", chapterIntro }: CapitalsSplitViewProps) {
  const { activeSectionIndex, scrollProgress } = useActiveSection();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setParallax({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  }, []);

  const handlePointerLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 1024;
  const isChapter = variant === "chapter";
  const [mobileScrollState, setMobileScrollState] = useState<'behind' | 'showcase' | 'passed'>('behind');
  const [relativeTop, setRelativeTop] = useState(0);
  const capitalsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const showcaseEl = document.getElementById("mobile-showcase-section");
      const parentEl = document.getElementById("capitals-pin-wrapper");
      if (!showcaseEl || !parentEl) return;

      const rect = showcaseEl.getBoundingClientRect();
      const parentRect = parentEl.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Calculate the showcase's top relative to capitals-pin-wrapper
      const currentRelativeTop = rect.top - parentRect.top;
      setRelativeTop(currentRelativeTop);

      // Transition from background ambient to showcase as soon as the showcase enters the screen (e.g. at 85% of screen height)
      if (rect.top <= viewHeight * 0.85 && rect.bottom >= viewHeight * 0.1) {
        setMobileScrollState('showcase');
      } else if (rect.bottom < viewHeight * 0.1) {
        setMobileScrollState('passed');
      } else {
        setMobileScrollState('behind');
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Immediate initial call and a small delay to handle layout settled heights
    handleScroll();
    const timer = setTimeout(handleScroll, 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      clearTimeout(timer);
    };
  }, [isMobile]);

  return (
    <>
    <div 
      className={`relative w-full h-auto main-grid-wrapper overflow-visible ${
        isChapter ? "" : "lg:min-h-[800vh]"
      }`}
      id="capitals-pin-wrapper"
    >
      <div className="relative w-full grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-visible h-auto lg:items-stretch">
        
        {/* LEFT COLUMN: 50% scrollable document storytelling flow (col-span-12 on mobile, col-span-6 on desktop) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col relative z-20 overflow-visible h-auto lg:h-full">
          
          {isChapter && chapterIntro && (
            <div
              id="six-capitals-intro"
              className="min-h-[50vh] flex flex-col justify-center relative overflow-visible py-12 lg:py-16"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="h-[1px] w-12 bg-[#C5A059]" />
                <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#C5A059] font-bold">
                  {chapterIntro.chapter}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif text-white leading-tight italic mb-3">
                {chapterIntro.title}
              </h2>

              {chapterIntro.subtitle && (
                <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed mb-6">
                  {chapterIntro.subtitle}
                </p>
              )}

              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                Scroll to browse — starting at Financial Capital
              </p>
            </div>
          )}

          {/* SECTION 0: LANDING HERO */}
          {!isChapter && (
          <div className="min-h-screen flex flex-col justify-center relative overflow-visible py-12 lg:py-24">
            <TextRevealCard
              id="hero"
              isActive={activeSectionIndex === 0}
              className="h-auto w-full flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[10px] font-mono tracking-widest text-[#C5A059] font-bold uppercase">
                  Alignment & Complexity Solved
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-[1.05] italic">
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

              {/* Responsive Sandbox Launch Trigger */}
              <div className="mt-8 flex flex-wrap gap-4 relative z-30">
                <button
                  onClick={() => {
                    const el = document.getElementById("active-cube-trigger");
                    if (el) {
                      el.click();
                    } else {
                      // Fallback: search for modal trigger globally
                      const btn = document.querySelector('[title="System Options Indicator"]') || document.getElementById("keep-rotating-btn") || document.getElementById("close-sandbox-btn");
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#b08b47] hover:to-[#C5A059] text-black text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(197,160,89,0.2)] hover:shadow-[0_15px_30px_rgba(197,160,89,0.35)] active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-black animate-pulse" />
                  <span>Launch 3D Interactive Sandbox</span>
                </button>
              </div>

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
            </TextRevealCard>
          </div>
          )}

          {/* MASTER PROGRAMMATIC CONTAINER FOR ALL 6 CAPITALS */}
          <div 
            ref={capitalsWrapperRef}
            id="universal-capitals-wrapper" 
            className="relative w-full lg:min-h-[300vh] h-auto flex flex-col overflow-visible"
          >
            {CAPITALS_DATA.map((capital) => {
              const isCurrent = activeSectionIndex === capital.index;

              return (
                <div 
                  key={capital.id}
                  id={capital.id}
                  className={`flex flex-col relative overflow-visible scroll-mt-24 ${
                    isChapter && capital.id === "natural"
                      ? "min-h-0 justify-start pt-8 pb-8"
                      : isChapter
                      ? "min-h-screen justify-start pt-8 pb-16"
                      : "min-h-screen justify-center py-12"
                  }`}
                >
                  <TextRevealCard
                    id={capital.id}
                    isActive={isCurrent}
                    compact={isChapter && capital.id === "natural"}
                    className={`h-auto w-full flex flex-col ${
                      isChapter ? "justify-start py-0" : "justify-center py-12"
                    }`}
                  >
                    {/* Massive Parallax Background Watermark */}
                    <div className="absolute right-4 top-1/4 text-[12vw] font-serif font-black tracking-tighter text-white/[0.015] select-none pointer-events-none uppercase leading-none">
                      {capital.id}
                    </div>

                    {/* Dynamic Luxury Technical Drawings Animation */}
                    <DynamicSchematic id={capital.id} isActive={isCurrent} />

                    {/* Vertical indexing line — scroll-sync anchor for cube carousel */}
                    <div
                      id={`${capital.id}-series-marker`}
                      className="flex items-center gap-4 mb-3"
                    >
                      <span className="h-[1px] w-12 bg-[#C5A059]"></span>
                      <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] font-bold font-mono">
                        0{capital.index} / 06 Capital Series
                      </span>
                      <div className="h-[1px] flex-grow bg-white/5 border-dashed max-w-[80px]"></div>
                    </div>

                    {/* Capital Header */}
                    <h1 className="text-4xl sm:text-6xl font-serif italic leading-[1.0] mb-5 text-white capitalize overflow-visible">
                      <KineticText text={capital.id} type="reveal" as="span" /> <br />
                      <span className="text-[#C5A059] not-italic">
                        <KineticText text="Capital" type="reveal" as="span" />
                      </span>
                    </h1>

                    {/* Slogan Quote Panel */}
                    <div className="mb-5 max-w-md">
                      <KineticText 
                        text={`“${capital.title}”`} 
                        type="highlight" 
                        as="p" 
                        className="text-lg sm:text-xl font-serif leading-relaxed italic text-white/90" 
                      />
                    </div>

                    <p className="text-xs sm:text-sm font-serif text-[#E5C079]/90 mb-6 max-w-md leading-relaxed tracking-wide">
                      {capital.concept}
                    </p>

                    <CapitalPdfActions capitalId={capital.id} />

                    <CapitalNarrativeBody paragraphs={capital.body} />
                  </TextRevealCard>
                </div>
              );
            })}
          </div>

          {/* BOARD OF DIRECTORS LEADERSHIP INSIGHTS */}
          {!isChapter && (
          <div className="py-16 sm:py-24 border-b border-white/5 relative z-20">
            <LeadershipInsights />
          </div>
          )}

          {/* MOBILE ONLY INTERACTIVE SPOTLIGHT SPACE - THE FREE SPACE ABOVE CONCLUSION */}
          {!isChapter && (
          <div 
            id="mobile-showcase-section" 
            className="lg:hidden min-h-[90vh] flex flex-col justify-center items-center relative z-20 text-center px-6 py-16"
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#C5A059]/5 text-[#C5A059] text-[10px] font-mono mb-6 animate-pulse select-none">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>3D INTERACTIVE WORKSPACE</span>
              </div>
              
              <h3 className="text-3xl font-serif text-white italic leading-tight mb-4 select-none">
                Interactive <br />
                <span className="text-[#C5A059] not-italic">Capitals Matrix</span>
              </h3>
              
              <p className="text-zinc-400 font-sans text-xs leading-relaxed max-w-xs mb-8 select-none">
                At this programmatic alignment node, background blurs are lifted. Use the 3D cube displayed in the space below to test and engage with our sustainability metrics directly.
              </p>

              {/* Real Interactive Floating 3D Cube Canvas rendered directly in parent flow */}
              <div className="w-[300px] h-[340px] flex items-center justify-center relative mb-8 overflow-visible">
                {isMobile && (
                  <div 
                    className={`w-full h-full flex items-center justify-center transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
                      mobileScrollState !== "behind"
                        ? "opacity-100 scale-100 filter-none pointer-events-auto translate-y-0"
                        : "opacity-0 scale-75 blur-[10px] pointer-events-none translate-y-12"
                    }`}
                  >
                    <CanvasContainer />
                  </div>
                )}
              </div>
              
              <button
                onClick={() => {
                  const el = document.getElementById("active-cube-trigger");
                  if (el) el.click();
                }}
                className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#b08b47] hover:to-[#C5A059] text-black text-[10px] font-mono font-bold tracking-widest uppercase transition-all duration-1000 shadow-[0_12px_25px_rgba(197,160,89,0.3)] active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  mobileScrollState !== "behind" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
                }`}
                title="Open Interactive Cube"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>ENGAGE SIMULATION</span>
              </button>
            </div>
          </div>
          )}

          {/* SECTION 7: FINAL ALIGNMENT & CONCLUSION */}
          {!isChapter && (
          <div className="min-h-screen flex flex-col justify-center relative overflow-visible py-12 lg:py-24">
            <TextRevealCard
              id="conclusion"
              isActive={activeSectionIndex === 7}
              className="h-auto w-full flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 mb-6 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="text-[10.5px] font-mono tracking-widest text-[#C5A059] font-bold uppercase">
                  Total Connection Solved
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-serif font-medium text-white tracking-tight leading-[1.05] italic">
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
            </TextRevealCard>
          </div>
          )}
        </div>

        {/* RIGHT COLUMN: Pinned + scroll-out Rubik cube (chapter) or legacy canvas (full) */}
        <div 
          id="cube-canvas-container"
          className={
            isMobile
              ? "hidden pointer-events-none"
              : isChapter
              ? "col-span-12 lg:col-span-6 h-[calc(100vh-5rem)] bg-transparent flex items-center justify-center p-4 sm:p-6 lg:p-8 z-10 overflow-visible desktop-canvas-container w-full will-change-transform"
              : "col-span-12 lg:col-span-6 lg:sticky lg:top-20 lg:self-start h-[calc(100vh-5rem)] bg-transparent flex items-center justify-center p-4 sm:p-6 lg:p-12 z-10 overflow-hidden desktop-canvas-container relative w-full"
          }
          style={isMobile ? { display: "none" } : undefined}
          onPointerMove={isChapter ? handlePointerMove : undefined}
          onPointerLeave={isChapter ? handlePointerLeave : undefined}
        >
          {isChapter ? (
            <div
              id="cube-scroll-inner"
              className="flex h-full w-full flex-col items-center justify-center will-change-transform"
            >
              <div className="flex h-full w-full max-w-lg flex-col items-center justify-center lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-[min(72vh,520px)] w-full items-stretch justify-center overflow-visible px-2 sm:px-4">
                  <CapitalCubeCarousel
                    activeSectionIndex={activeSectionIndex}
                    scrollProgress={scrollProgress}
                    sizeMultiplier={1.42}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full max-w-lg flex-col items-center justify-center lg:max-w-2xl xl:max-w-3xl">
              <CanvasContainer />
            </div>
          )}
        </div>

      </div>

    </div>
  </>
  );
}
