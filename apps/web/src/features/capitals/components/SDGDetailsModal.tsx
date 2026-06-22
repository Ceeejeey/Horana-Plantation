import React, { useState, useEffect } from "react";
import { X, CheckCircle2, ShieldAlert, Award, HelpingHand, Target, Sparkles, Activity, ShieldCheck, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SDG_METADATA } from "../capitalsData";

interface SDGDetailsModalProps {
  sdgNumber: number | null;
  onClose: () => void;
}

// System descriptions for each SDG and how Horana solves it
export const SDG_RESOLUTIONS: Record<number, { statement: string; actions: string[]; metrics: string }> = {
  1: {
    statement: "Eliminating poverty across plantations by ensuring absolute fair compensation, equal livelihood opportunities, and strong social safety nets.",
    actions: [
      "Fairtrade wage premiums distributed directly to harvesting team accounts",
      "Robust housing cooperatives offering modern low-cost housing credits",
      "Micro-loan provisions for secondary household cottage business streams",
      "Complimentary transport lines connecting estates with municipal colleges"
    ],
    metrics: "Over 8,400 worker households secured with sustainable baseline wages of 100% fair wage index parameters."
  },
  2: {
    statement: "Securing nutritional autonomy and zero hunger across worker coordinates through estate-led food production partnerships.",
    actions: [
      "Free allocation of arable estate plots for organic household home gardens",
      "High-yield crop seed and organic plant compost starter distributions",
      "Community poultry, egg, and dairy farming co-ops on estate boundaries",
      "Systematic nutritional supplement schemes for pregnant and nursing mothers"
    ],
    metrics: "100% of workers' children provided with daily organic dairy & egg meals, combating maternal anemia by 42%."
  },
  3: {
    statement: "Championing comprehensive physiological and psychological health across our rural estates coordinates.",
    actions: [
      "Fully staffed estate medical dispensaries and ambulance transfer networks",
      "Bi-annual specialized dental, optical, and cardiovascular mobile clinics",
      "Maternal health seminars, counseling, and direct nutritional evaluations",
      "Regular health audits focusing on sanitary sanitation grids and preventive health"
    ],
    metrics: "24/7 emergency medical support available for 100% of highland estate residents."
  },
  4: {
    statement: "Cultivating elite education pathways and training programs for estate youth and administrative teams.",
    actions: [
      "Early Child Care Centers (ECCC) with qualified trained personnel",
      "Secondary school scholarship schemes for higher-grade learners",
      "State-of-the-art digital IT research laboratories and libraries",
      "Custom languages, tech literacy, and arithmetic evening seminars"
    ],
    metrics: "ECCC enrollment maintained at 100% across all tea divisions with zero child labor."
  },
  5: {
    statement: "Fostering absolute gender equality and safe, dignified livelihoods for all worker families.",
    actions: [
      "Equal-pay charters for all harvesting and technical field employees",
      "Active female worker representation in executive Estate committees",
      "Zero-tolerance child safety and community anti-harassment boards",
      "Self-care workshops and vocational skills training for female youth"
    ],
    metrics: "Over 54% of field supervisors at Horana are certified female leaders."
  },
  6: {
    statement: "Guaranteeing pristine water distribution and premium sanitation grids for internal estate layouts.",
    actions: [
      "Advanced reverse osmosis filtration centers near central mountain springs",
      "Strict protection buffer zones bounding all active highland river paths",
      "Modern closed sanitation grids, protecting underground aquifers",
      "Continuous chemical analysis of raw spring waters by internal lab teams"
    ],
    metrics: "Zero watershed chemical contamination recorded across audited estates."
  },
  7: {
    statement: "Decarbonizing production systems via grid-tied multi-tenant clean energy facilities.",
    actions: [
      "Vast rooftop solar PV systems on central tea and latex processing factories",
      "Micro-hydro stream turbines operating continuously in high-precip hills",
      "Efficient forest bioenergy plantations supplying thermal woodchips to boilers",
      "Systematic integration of smart electricity meters with national CEB grid"
    ],
    metrics: "Over 85% of Horana factory processing machinery is energized by clean captive energy."
  },
  8: {
    statement: "Nurturing an inclusive, high-growth economic environment that prioritizes workers and families.",
    actions: [
      "ILO-compliant occupational safety protocols and modern hazard apparel",
      "Fair worker representation unions and open negotiation frameworks",
      "Continuous skills upscaling in precision agronomy and ERP interfaces",
      "Coherent career path progress paths from harvester to division lead"
    ],
    metrics: "Dignified work certifications held across all audited plantations."
  },
  9: {
    statement: "Leading digital plantation modernization through IoT diagnostic nodes and premium transport infrastructure.",
    actions: [
      "IoT moisture, nitrogen, and crop temperature sensory arrays in fields",
      "Smart scale terminals automatically logging harvest weight with RFID cards",
      "Comprehensive machinery automation and dry-air telemetry in factories",
      "Internal research on eco-efficient climate-resilient crop breeding models"
    ],
    metrics: "Real-time crop telemetry integrated with our central SAP cloud infrastructure."
  },
  10: {
    statement: "Bridging economic divisions on estates by fostering inclusive outgrower and cooperative networks.",
    actions: [
      "Fair outgrower procurement models offering premium crop payment structures",
      "Direct technical training shared with external agricultural neighbors",
      "Community infrastructure investments including roads, gyms, and sports fields",
      "Equal representation of all minority groups in administrative boards"
    ],
    metrics: "Over 2,200 external smallholders empowered through our shared agricultural network."
  },
  12: {
    statement: "Eradicating chemical waste and single-use plastic streams across all estate sectors.",
    actions: [
      "Biomass compost recycling systems transforming tea clippings to organic humus",
      "Rainforest Alliance compliant minimal crop sprayer regimes",
      "Strict ban on single-use poly bags with green jute paper substitutes",
      "Zero chemical residue target on finished tea and rubber latex outputs"
    ],
    metrics: "Completely certified by global Rainforest Alliance with premium sustainable rankings."
  },
  13: {
    statement: "Executing proactive climate adaptation through carbon forestry and microclimate monitoring.",
    actions: [
      "Massive highland reforestation using native endemic canopy trees",
      "Strategic shade-tree layers in tea fields to cool soil microbes and adjust UV",
      "Carbon absorption auditing across all estate forests and rubber crops",
      "Responsive field irrigation systems triggered by real-time predictive weather AI"
    ],
    metrics: "Maintained climate resilient crops, contributing to a carbon-absorbing index net sink."
  },
  14: {
    statement: "Conserving native aquatic ecosystems, streams, and highland springs.",
    actions: [
      "Prohibiting fertilizer application within critical yards of mountain springs",
      "Biological filter reed banks lining all estate creek borders",
      "Zero discharge of untreated factory wash fluids into community streams",
      "Wetland buffer zone rehabilitation near rubber estates"
    ],
    metrics: "Mountain springs and streams certified as pristine biological category-A waterways."
  },
  15: {
    statement: "Securing terrestrial biodiversity and maintaining native jungle paths.",
    actions: [
      "Continuous protection of primary forest reserves inside estate boundaries",
      "Establishing bio-shield corridors to permit safe wildlife movement",
      "Strictest ban on poaching, snaring, or logging across all divisions",
      "Pioneering natural biological pest controls instead of synthetic biocides"
    ],
    metrics: "Over 1,200 acres of high biodiversity mountain forests protected under lock."
  },
  17: {
    statement: "Executing systemic progress through global clean trade agreements.",
    actions: [
      "Active research alignments with national Tea Research Institutes",
      "Deep cooperation with United Nations agencies on sustainability audits",
      "Partnerships with European and East Asian fairtrade wholesale boards",
      "Co-founding national agro-climate tech coalitions for agricultural digitization"
    ],
    metrics: "Global distribution alignments, securing worldwide ESG supply parity."
  }
};

export function SDGDetailsModal({ sdgNumber, onClose }: SDGDetailsModalProps) {
  // Sync selected SDG into an internal state to prevent content flickering/blanking during exit animation
  const [activeSDG, setActiveSDG] = useState<number | null>(null);

  useEffect(() => {
    if (sdgNumber !== null) {
      setActiveSDG(sdgNumber);
    }
  }, [sdgNumber]);

  const isOpen = sdgNumber !== null;

  // Derive meta info using the non-null activeSDG
  const metadata = activeSDG ? SDG_METADATA[activeSDG] : null;
  const resolution = activeSDG ? SDG_RESOLUTIONS[activeSDG] : null;

  if (!metadata || !resolution) return null;

  const resolvedSdgNum = activeSDG as number;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop layer with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 bg-[#030a06]/85 backdrop-blur-[14px]"
          />

          {/* Luxury Floating Dust/Glow particles inside backdrop for spatial depth */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <div 
              className="absolute w-72 h-72 rounded-full opacity-10 blur-[80px] animate-pulse transition-colors duration-1000"
              style={{
                background: metadata.color,
                left: "30%",
                top: "20%",
                animationDuration: "8s"
              }}
            />
            <div 
              className="absolute w-60 h-60 rounded-full opacity-[0.06] blur-[60px] animate-pulse"
              style={{
                background: "#C5A059",
                right: "30%",
                bottom: "20%",
                animationDuration: "12s"
              }}
            />
          </div>

          {/* Premium Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30, rotateX: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 25, rotateX: 4 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            style={{ 
              perspective: 1000,
              transformStyle: "preserve-3d"
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-gradient-to-b from-[#0f1914] to-[#050b08] border border-[#C5A059]/35 rounded-[24px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.08),0_0_50px_rgba(197,160,89,0.06)] z-10"
          >
            {/* Elegant luxury top brand bar */}
            <div className="w-16 h-1 bg-[#C5A059]/40 mx-auto rounded-full mt-3.5 mb-1" />

            {/* Glowing theme-coordinated header block */}
            <div className="relative p-6 px-7 sm:px-8 flex items-center justify-between border-b border-white/5 overflow-hidden">
              {/* Radial gradient backing based on the active SDG color */}
              <div 
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  background: `radial-gradient(circle at right center, ${metadata.color} 0%, transparent 80%)`
                }}
              />

              <div className="flex items-center gap-4 relative z-10">
                {/* Elegant numeric stamp */}
                <div 
                  className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-display font-black text-white shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)]"
                  style={{ 
                    backgroundColor: metadata.color,
                    boxShadow: `0 8px 24px -6px ${metadata.color}CC, inset 0 2px 4px rgba(255,255,255,0.3)`
                  }}
                >
                  <span className="text-2xl tracking-tighter leading-none mt-0.5">{resolvedSdgNum < 10 ? `0${resolvedSdgNum}` : resolvedSdgNum}</span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-mono tracking-[0.25em] text-[#C5A059]/80 font-bold block leading-none">
                      UN alignment index
                    </span>
                    <Sparkles className="w-3 h-3 text-[#C5A059]/75" />
                  </div>
                  <h3 className="text-xl font-serif text-white tracking-tight mt-1.5 leading-tight font-semibold">
                    {metadata.name}
                  </h3>
                </div>
              </div>

              {/* Close target in top corner */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95 text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer self-start relative z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main content body */}
            <div className="p-7 sm:p-8 flex flex-col gap-6 relative z-10">
              {/* Mission Statement of the SDG */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#C5A059] block mb-2.5">
                  Strategic Objective Overview
                </span>
                
                {/* Quotation block styled like a high-end corporate ESG dossier */}
                <div className="relative pl-4 border-l-2 border-[#C5A059]/40 py-1 bg-white/[0.02] rounded-r-xl pr-3">
                  <p className="text-sm font-sans text-emerald-100/90 leading-relaxed font-normal italic">
                    "{resolution.statement}"
                  </p>
                </div>
              </div>

              {/* Horana Actions block */}
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="h-[1px] w-3.5 bg-[#C5A059]" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-[#C5A059]">
                    Tactical Implementation Actions
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {resolution.actions.map((act, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ x: 4, backgroundColor: "rgba(197, 160, 89, 0.04)" }}
                      className="flex items-start gap-3.5 p-2.5 rounded-xl border border-white/[0.03] bg-white/[0.01] hover:border-[#C5A059]/20 transition-all duration-300 group"
                    >
                      {/* Premium action index bullet */}
                      <div className="w-5 h-5 rounded-full border border-[#C5A059]/45 bg-[#C5A059]/10 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-mono text-[#C5A059] group-hover:bg-[#C5A059] group-hover:text-[#050b08] transition-all duration-300">
                        {idx + 1}
                      </div>
                      <span className="text-zinc-300 font-sans text-xs leading-relaxed group-hover:text-white transition-colors">
                        {act}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Status Certificate Ledger Block */}
              <div className="relative p-4 rounded-2xl bg-gradient-to-r from-[#070e0b] to-[#030705] border border-emerald-500/20 text-xs mt-1 shadow-inner overflow-hidden">
                {/* Subtle side glow */}
                <div className="absolute top-0 right-0 w-24 h-full bg-emerald-500/5 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Strategic Audit Verification Ledger</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-wider animate-pulse">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                    <span>Verified</span>
                  </div>
                </div>

                <p className="font-serif italic text-emerald-300 text-sm leading-relaxed font-medium">
                  {resolution.metrics}
                </p>
              </div>

              {/* Closing controls */}
              <div className="flex items-center justify-end gap-3 mt-2 border-t border-white/5 pt-5">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-[#C5A059]/40 hover:border-[#C5A059] bg-[#C5A059]/5 hover:bg-[#C5A059] text-[#C5A059] hover:text-black text-xs font-mono font-semibold uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(197,160,89,0.3)] active:scale-95 ease-out"
                >
                  Dismiss Ledger
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
