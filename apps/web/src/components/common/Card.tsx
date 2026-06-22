import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className = "", glow = false }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-zinc-950/40 backdrop-blur-md border border-zinc-900 overflow-hidden ${
        glow ? "shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "shadow-xl"
      } hover:border-emerald-500/20 transition-all duration-500 hover:translate-y-[-2px] ${className}`}
    >
      {children}
    </div>
  );
}
