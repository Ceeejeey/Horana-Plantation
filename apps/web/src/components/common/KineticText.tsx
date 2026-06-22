import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface KineticTextProps {
  text: string;
  type?: "reveal" | "highlight";
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  stagger?: number;
  duration?: number;
  yOffset?: number;
}

export function KineticText({
  text,
  type = "reveal",
  className = "",
  as: Component = "span",
  stagger = 0.02,
  duration = 0.85,
  yOffset = 100,
}: KineticTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ctx = gsap.context(() => {
      if (type === "reveal") {
        const targets = el.querySelectorAll(".kinetic-target");
        if (targets.length === 0) return;

        // Apple-style modern overflow mask offset translation (Zero Opacity changes)
        gsap.fromTo(
          targets,
          {
            yPercent: yOffset,
            skewY: 6,
          },
          {
            yPercent: 0,
            skewY: 0,
            duration: duration,
            stagger: stagger,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else if (type === "highlight") {
        // High-end scrubbing linear-gradient text clip mask
        gsap.fromTo(
          el,
          {
            backgroundPosition: "100% 0%",
          },
          {
            backgroundPosition: "0% 0%",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [type, yOffset, duration, stagger, text]);

  if (type === "highlight") {
    return (
      <Component
        ref={containerRef as any}
        className={`kinetic-highlight-container inline-block leading-relaxed select-none ${className}`}
        id={`kinetic-text-highlight-${Math.random().toString(36).substring(2, 9)}`}
        style={{
          backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 50%, rgba(255, 255, 255, 0.15) 50.1%, rgba(255, 255, 255, 0.15) 100%)",
          backgroundSize: "200% 100%",
          backgroundPosition: "100% 0%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
          willChange: "background-position",
        }}
      >
        {text}
      </Component>
    );
  }

  // Type === "reveal" -> Character elements rise out of overflow-hidden word containers
  const wordsArray = text.split(/\s+/);
  return (
    <Component
      ref={containerRef as any}
      className={`kinetic-reveal-container inline-flex flex-wrap ${className}`}
      id={`kinetic-text-reveal-${Math.random().toString(36).substring(2, 9)}`}
    >
      {wordsArray.map((word, wordIdx) => (
        <span 
          key={wordIdx} 
          className="inline-block whitespace-nowrap mr-[0.25em] overflow-hidden py-1 align-bottom"
          style={{ verticalAlign: "bottom" }}
        >
          {word.split("").map((char, charIdx) => (
            <span
              key={charIdx}
              className="kinetic-target inline-block will-change-transform"
              style={{ display: "inline-block" }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </Component>
  );
}
