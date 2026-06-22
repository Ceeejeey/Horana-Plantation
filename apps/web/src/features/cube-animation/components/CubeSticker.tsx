import React from "react";
import { 
  Coins, TrendingUp, Cpu, Zap, Droplets, Infinity as InfinityIcon, 
  GraduationCap, HeartPulse, Scale, Handshake, Users2, 
  Trees, Leaf, Globe2, Waves, Sprout, Building2, Layers, Compass, Heart
} from "lucide-react";

interface CubeStickerProps {
  face: "front" | "back" | "left" | "right" | "top" | "bottom";
  x: number; // -1, 0, 1
  y: number; // -1, 0, 1
  z: number; // -1, 0, 1
}

export function CubeSticker({ face, x, y, z }: CubeStickerProps) {
  let content: React.ReactNode = null;

  // Helper for rendering SDG sticker
  const renderSDGSticker = (num: number, title: string, color: string, IconComponent: any) => {
    return (
      <div 
        className="w-full h-full p-1.5 flex flex-col justify-between select-none shadow-inner rounded-md"
        style={{ backgroundColor: color }}
      >
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold font-mono text-white tracking-tighter leading-none bg-black/20 px-1 py-0.5 rounded">
            {num}
          </span>
          <IconComponent className="w-3.5 h-3.5 text-white/90 stroke-[2]" />
        </div>
        <div className="text-[7.5px] font-bold font-display uppercase leading-tight text-white tracking-wider break-words line-clamp-2">
          {title}
        </div>
      </div>
    );
  };

  // Helper for rendering premium adaptive custom illustration
  const renderIllustration = (title: string, subtitle: string, bgGradient: string, Icon: any) => {
    return (
      <div className={`w-full h-full p-1.5 flex flex-col justify-between selection:bg-transparent ${bgGradient} text-white shadow-inner rounded-md`}>
        <div className="flex justify-between items-center">
          <Icon className="w-3.5 h-3.5 text-white/90 stroke-[1.5]" />
          <span className="text-[6.5px] tracking-widest font-mono text-white/80 uppercase bg-white/15 px-1 py-0.5 rounded-full leading-none">
            HPG
          </span>
        </div>
        <div className="flex flex-col justify-end leading-none">
          <span className="text-[7.5px] font-display font-bold uppercase tracking-tight text-white/95">
            {title}
          </span>
          <span className="text-[6.5px] font-sans font-medium text-white/80 mt-0.5 opacity-90 line-clamp-1">
            {subtitle}
          </span>
        </div>
      </div>
    );
  };

  // Helper for rendering the premium center piece - now beautifully matching the face theme background/gradients!
  const renderLogoCenter = (capitalName: string, bgGradient: string) => {
    return (
      <div className={`w-full h-full p-1.5 flex flex-col items-center justify-center selection:bg-transparent ${bgGradient} text-white shadow-inner relative rounded-md`}>
        <div className="w-7 h-7 rounded-full bg-black/20 border border-white/10 flex items-center justify-center relative shadow-sm">
          <div className="absolute inset-0.5 rounded-full border border-dashed border-white/30 animate-spin" style={{ animationDuration: "12s" }}></div>
          <Compass className="w-3.5 h-3.5 text-white/95" />
        </div>
        <span className="text-[6.5px] font-mono tracking-widest text-white/90 font-bold uppercase mt-1 leading-none text-center">
          {capitalName}
        </span>
      </div>
    );
  };

  // 1. FRONT FACE: FINANCIAL CAPITAL (Vibrant Red Theme)
  if (face === "front") {
    const redGrad = "bg-linear-to-b from-red-500 via-red-600 to-red-800";
    content = renderIllustration("Financial", "Capital", redGrad, Coins);
  }

  // 2. RIGHT FACE: MANUFACTURED CAPITAL (Slate Gray Theme)
  else if (face === "right") {
    const grayGrad = "bg-linear-to-b from-zinc-500 via-[#61616a] to-zinc-700";
    content = renderIllustration("Manufactured", "Capital", grayGrad, Building2);
  }

  // 3. TOP FACE: INTELLECTUAL CAPITAL (High-Tech Sky Blue Theme)
  else if (face === "top") {
    const cyanGrad = "bg-linear-to-b from-cyan-500 via-cyan-600 to-cyan-800";
    content = renderIllustration("Intellectual", "Capital", cyanGrad, Compass);
  }

  // 4. LEFT FACE: HUMAN CAPITAL (Elegant Amber / Orange Theme)
  else if (face === "left") {
    const orangeGrad = "bg-linear-to-b from-orange-500 via-orange-600 to-orange-800";
    content = renderIllustration("Human", "Capital", orangeGrad, Heart);
  }

  // 5. BOTTOM FACE: SOCIAL & RELATIONSHIP CAPITAL (Vibrant Indigo Theme)
  else if (face === "bottom") {
    const indigoGrad = "bg-linear-to-b from-indigo-500 via-indigo-600 to-indigo-800";
    content = renderIllustration("Social", "Capital", indigoGrad, Handshake);
  }

  // 6. BACK FACE: NATURAL CAPITAL (Deep Emerald Green Theme)
  else if (face === "back") {
    const emeraldGrad = "bg-linear-to-b from-emerald-500 via-emerald-600 to-emerald-800";
    content = renderIllustration("Natural", "Capital", emeraldGrad, Sprout);
  }

  return (
    <div className="w-full h-full rounded-md overflow-hidden select-none border-0.5 border-black/15 bg-zinc-900 scale-[0.98]">
      {content}
    </div>
  );
}
