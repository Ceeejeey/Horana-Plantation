import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealCardProps {
  children: React.ReactNode;
  id: string;
  isActive: boolean;
  onEnter?: () => void;
  className?: string;
  /** Chapter last capital: drop forced min-h-screen so no empty tail scrolls. */
  compact?: boolean;
  key?: string | number;
}

export function TextRevealCard({ 
  children, 
  id, 
  isActive, 
  onEnter,
  className = "",
  compact = false,
}: TextRevealCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onEnterRef = useRef(onEnter);

  // Keep the ref updated with the latest onEnter function
  useEffect(() => {
    onEnterRef.current = onEnter;
  }, [onEnter]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    // Check if element is already inside or near the viewport on load
    const rect = element.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight * 0.85;

    if (isInViewport) {
      // Gentle initial fade-in for elements already in scope (like the landing hero)
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 15,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: 0.75,
          ease: "power2.out",
          clearProps: "all",
          onComplete: () => {
            if (onEnterRef.current) onEnterRef.current();
          }
        }
      );
    } else {
      // Immediately set initial state for off-screen cards to avoid flash of content
      gsap.set(element, {
        opacity: 0,
        y: 45,
        filter: "blur(8px)",
        pointerEvents: "none",
      });

      // Create modern on-scroll entrance trigger
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 85%",
        onEnter: () => {
          if (onEnterRef.current) onEnterRef.current();
          
          gsap.to(
            element,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              pointerEvents: "auto",
              duration: 1.0,
              ease: "power3.out",
              clearProps: "all",
            }
          );
        },
        once: true, // Animates smoothly once on entrance, keeping content persistent and fully readable
      });

      return () => {
        trigger.kill();
      };
    }
  }, [id]);

  return (
    <div
      ref={containerRef}
      id={`text-reveal-sec-${id}`}
      className={`${compact ? "min-h-0" : "min-h-screen"} w-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-visible select-none gpu-accelerated ${className}`}
      style={{ 
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Background radial gradient overlay to protect letter readability */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#05070B]/5 to-[#05070B]/95 pointer-events-none -z-10 rounded-3xl h-full w-full"></div>
      
      {/* Structural layout content block */}
      <div className="w-full max-w-xl md:max-w-2xl mx-auto relative z-20">
        {children}
      </div>
    </div>
  );
}
