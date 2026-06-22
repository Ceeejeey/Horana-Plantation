import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export function Button({ children, variant = "primary", size = "md", className = "", onClick, disabled, ...props }: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-mono tracking-wider uppercase rounded-lg transition-all duration-300 pointer-events-auto cursor-pointer border select-none h-fit";
  
  const variants = {
    primary: "bg-emerald-900 border-emerald-500/35 text-white hover:bg-emerald-800 hover:border-emerald-500 shadow-md",
    secondary: "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white",
    outline: "bg-transparent border-emerald-500/25 text-emerald-400 hover:bg-emerald-950/20 hover:border-emerald-500/50",
    gold: "bg-[#D3A243] border-[#D3A243]/80 text-zinc-950 font-bold hover:bg-[#D3A243]/95 shadow-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2.5 text-xs",
    lg: "px-7 py-3.5 text-xs sm:text-sm",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

