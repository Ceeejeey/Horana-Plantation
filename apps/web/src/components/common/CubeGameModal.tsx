import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, HelpCircle, Shuffle, RotateCcw, CheckCircle, 
  Sparkles, Keyboard, Volume2, Timer, Milestone,
  Sliders, Compass, Heart, BarChart3, Sprout, Landmark,
  LogOut, AlertTriangle, Coins, Building2, Handshake
} from "lucide-react";
import { useActiveSection } from "../../context/ActiveSectionContext";
import { CubeSticker } from "../../features/cube-animation/components/CubeSticker";
import { CubeCorporateShowcase } from "./CubeCorporateShowcase";
import { TenYearSummaryDashboard } from "../../features/annual-report/components/TenYearSummaryDashboard";

const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 18 }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let index = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <span className="font-mono">{displayed}</span>;
};

interface CubeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FaceName = "front" | "back" | "left" | "right" | "top" | "bottom";

// High-end capitals branding mapping
interface CapitalConfig {
  hex: string;
  label: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const BRAND_COLORS: Record<FaceName, CapitalConfig> = {
  front: { 
    hex: "#EF4444", 
    label: "FIN", 
    name: "Financial Capital", 
    desc: "Vibrant red cashflow & financial assets",
    icon: Coins
  },
  back: { 
    hex: "#10B981", 
    label: "NAT", 
    name: "Natural Capital", 
    desc: "Soil biodiversity & water systems",
    icon: Sprout
  },
  left: { 
    hex: "#F97316", 
    label: "HUM", 
    name: "Human Capital", 
    desc: "Worker safety & team welfare",
    icon: Heart
  },
  right: { 
    hex: "#71717A", 
    label: "MFG", 
    name: "Manufactured Capital", 
    desc: "Estate factories & processing scale",
    icon: Building2
  },
  top: { 
    hex: "#06B6D4", 
    label: "INT", 
    name: "Intellectual Capital", 
    desc: "Precision agronomy & satellite science",
    icon: Compass
  },
  bottom: { 
    hex: "#4F46E5", 
    label: "SOC", 
    name: "Social Capital", 
    desc: "Community trust & smallholder partnerships",
    icon: Handshake
  }
};

// Represents interactive state of a single cubie block
interface Cubie {
  id: string;
  // Spatial relative position indices in {-1, 0, 1}
  x: number; 
  y: number; 
  z: number;
  // Starting relative position indices
  origX: number;
  origY: number;
  origZ: number;
  // Custom sticker color index mapping on outer faces
  faces: Record<FaceName, FaceName>;
}

export function CubeGameModal({ isOpen, onClose }: CubeGameModalProps) {
  const { setActiveSectionIndex, setScrollProgress } = useActiveSection();

  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileSize = windowWidth < 640;

  const [cubies, setCubies] = useState<Cubie[]>([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraX, setCameraX] = useState(-25); // Pitch
  const [cameraY, setCameraY] = useState(45);  // Yaw
  const [scrambling, setScrambling] = useState(false);
  const [solved, setSolved] = useState(false);
  const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
  const [moveHistory, setMoveHistory] = useState<{
    axis: "x" | "y" | "z";
    layer: number;
    clockwise: boolean;
  }[]>([]);

  // Custom game workspace options & constraints as requested
  const [gameMode, setGameMode] = useState<"free" | "challenge">("free");
  const [scrambleDifficulty, setScrambleDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [countdownMode, setCountdownMode] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(180); // 3 minutes standard executive window
  const [gameOverTimeOut, setGameOverTimeOut] = useState(false);
  const [dismissCelebration, setDismissCelebration] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"options" | "rules" | "legend" | "portfolio" | "financials">("portfolio");
  const [tabsExpanded, setTabsExpanded] = useState(true);

  // Active turning state of any moving layer for perfect 3D cinematic animations
  const [activeTurn, setActiveTurn] = useState<{
    axis: "x" | "y" | "z";
    layer: number;
    clockwise: boolean;
  } | null>(null);

  // Sticker selection state to support easy point-and-click / keyboard arrow rotations
  const [selectedSticker, setSelectedSticker] = useState<{
    face: FaceName;
    x: number;
    y: number;
    z: number;
  } | null>(null);

  // Interactive Onboarding On-demand Guide State
  const [tutorialActive, setTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(1);
  const [movesAtStepStart, setMovesAtStepStart] = useState(0);

  // Solved stack tracker and AI guide helper states
  const [solvedStack, setSolvedStack] = useState<{
    axis: "x" | "y" | "z";
    layer: number;
    clockwise: boolean;
  }[]>([]);
  const [isAiSupportActive, setIsAiSupportActive] = useState(false);
  const [aiIntroModal, setAiIntroModal] = useState(false);
  const [introTimerProgress, setIntroTimerProgress] = useState(100);

  // Automatically fade out the instruction modal after 4.5 seconds
  useEffect(() => {
    if (aiIntroModal) {
      setIntroTimerProgress(100);
      const totalDuration = 4500;
      const intervalDelay = 45;
      const steps = totalDuration / intervalDelay;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const remainingPercentage = Math.max(0, 100 - (currentStep / steps) * 100);
        setIntroTimerProgress(remainingPercentage);
        if (currentStep >= steps) {
          clearInterval(timer);
          setAiIntroModal(false);
        }
      }, intervalDelay);
      
      return () => clearInterval(timer);
    }
  }, [aiIntroModal]);

  // Automatically start onboarding if not completed on desktop size views
  useEffect(() => {
    if (isOpen) {
      if (typeof window !== "undefined") {
        const completed = localStorage.getItem("capitalsCubeTutorialCompleted");
        if (!completed && windowWidth >= 1024) {
          setTutorialActive(true);
          setTutorialStep(1);
        } else {
          setTutorialActive(false);
        }
      }
    } else {
      setTutorialActive(false);
    }
  }, [isOpen, windowWidth]);

  // Auto-advance tutorial steps based on user interactions
  useEffect(() => {
    if (tutorialActive && tutorialStep === 2 && selectedSticker) {
      setTutorialStep(3);
    }
  }, [selectedSticker, tutorialActive, tutorialStep]);

  useEffect(() => {
    if (tutorialActive && tutorialStep === 3) {
      setMovesAtStepStart(moves);
    }
  }, [tutorialActive, tutorialStep]);

  useEffect(() => {
    if (tutorialActive && tutorialStep === 3 && moves > movesAtStepStart) {
      setTutorialStep(4);
    }
  }, [moves, movesAtStepStart, tutorialActive, tutorialStep]);

  const handleStickerSelect = (targetFace: FaceName, x: number, y: number, z: number) => {
    if (scrambling || activeTurn) return;
    playChirp(720, 0.05);

    setSelectedSticker((prev) => {
      if (prev && prev.face === targetFace && prev.x === x && prev.y === y && prev.z === z) {
        return null;
      }
      return { face: targetFace, x, y, z };
    });
  };

  const handleArrowRotation = (direction: "up" | "down" | "left" | "right") => {
    if (!selectedSticker || scrambling || activeTurn) return;

    // Find the current physical cubie block resting in this visual space slot coordinate
    const cubie = cubies.find(
      (c) => c.x === selectedSticker.x && c.y === selectedSticker.y && c.z === selectedSticker.z
    );
    if (!cubie) return;

    const { face } = selectedSticker;

    if (face === "front") {
      if (direction === "left") rotateLayer("y", cubie.y, true);
      else if (direction === "right") rotateLayer("y", cubie.y, false);
      else if (direction === "up") rotateLayer("x", cubie.x, false);
      else if (direction === "down") rotateLayer("x", cubie.x, true);
    } 
    else if (face === "back") {
      if (direction === "left") rotateLayer("y", cubie.y, false);
      else if (direction === "right") rotateLayer("y", cubie.y, true);
      else if (direction === "up") rotateLayer("x", cubie.x, true);
      else if (direction === "down") rotateLayer("x", cubie.x, false);
    } 
    else if (face === "left") {
      if (direction === "left") rotateLayer("y", cubie.y, true);
      else if (direction === "right") rotateLayer("y", cubie.y, false);
      else if (direction === "up") rotateLayer("z", cubie.z, true);
      else if (direction === "down") rotateLayer("z", cubie.z, false);
    } 
    else if (face === "right") {
      if (direction === "left") rotateLayer("y", cubie.y, false);
      else if (direction === "right") rotateLayer("y", cubie.y, true);
      else if (direction === "up") rotateLayer("z", cubie.z, false);
      else if (direction === "down") rotateLayer("z", cubie.z, true);
    } 
    else if (face === "top") {
      if (direction === "left") rotateLayer("z", cubie.z, true);
      else if (direction === "right") rotateLayer("z", cubie.z, false);
      else if (direction === "up") rotateLayer("x", cubie.x, false);
      else if (direction === "down") rotateLayer("x", cubie.x, true);
    } 
    else if (face === "bottom") {
      if (direction === "left") rotateLayer("z", cubie.z, false);
      else if (direction === "right") rotateLayer("z", cubie.z, true);
      else if (direction === "up") rotateLayer("x", cubie.x, true);
      else if (direction === "down") rotateLayer("x", cubie.x, false);
    }
  };

  // Interfaces for AI Solver output
  interface SolveStep {
    targetSticker: { face: FaceName; x: number; y: number; z: number };
    direction: "up" | "down" | "left" | "right";
    desc: string;
  }

  const getNextSolveStep = (): SolveStep | null => {
    if (solvedStack.length === 0) return null;
    
    // The next move to execute is the inverse of the LAST move currently in the solvedStack!
    const lastMove = solvedStack[solvedStack.length - 1];
    const targetAxis = lastMove.axis;
    const targetLayer = lastMove.layer;
    const targetClockwise = !lastMove.clockwise; // Invert to solve!
    
    if (targetAxis === "y") {
      const layerName = targetLayer === -1 ? "Top Layer (Cyan)" : targetLayer === 0 ? "Middle Row" : "Bottom Layer (Indigo)";
      return {
        targetSticker: { face: "front", x: 0, y: targetLayer, z: 1 },
        direction: targetClockwise ? "left" : "right",
        desc: `Rotate ${layerName} to the ${targetClockwise ? "Left ◀" : "Right ▶"}`
      };
    } else if (targetAxis === "x") {
      const colName = targetLayer === -1 ? "Left Column (Emerald)" : targetLayer === 0 ? "Middle Column" : "Right Column (Red)";
      return {
        targetSticker: { face: "front", x: targetLayer, y: 0, z: 1 },
        direction: targetClockwise ? "down" : "up",
        desc: `Rotate ${colName} ${targetClockwise ? "Down ▼" : "Up ▲"}`
      };
    } else if (targetAxis === "z") {
      const layerName = targetLayer === -1 ? "Back Face" : targetLayer === 0 ? "Middle Depth" : "Front Face";
      return {
        targetSticker: { face: "right", x: 1, y: 0, z: targetLayer },
        direction: targetClockwise ? "down" : "up",
        desc: `Rotate ${layerName} on the side face ${targetClockwise ? "Down ▼" : "Up ▲"}`
      };
    }
    
    return null;
  };

  // Sync selection when AI solver is active so user is automatically guided
  useEffect(() => {
    if (isAiSupportActive && !solved && solvedStack.length > 0) {
      const step = getNextSolveStep();
      if (step) {
        setSelectedSticker(step.targetSticker);
      }
    }
  }, [isAiSupportActive, solvedStack, solved]);

  const getStickerLabel = (face: FaceName, origX: number, origY: number, origZ: number) => {
    let mapX = origX;
    let mapY = origY;
    if (face === "top" || face === "bottom") {
      mapX = origX;
      mapY = origZ;
    } else if (face === "left" || face === "right") {
      mapX = origZ;
      mapY = origY;
    }

    if (face === "front") {
      if (mapX === -1 && mapY === -1) return { title: "Growth", desc: "Strategic Crop Yields" };
      if (mapX === 0 && mapY === -1) return { title: "Resilience", desc: "Market Diversification" };
      if (mapX === 1 && mapY === -1) return { title: "SDG 1", desc: "No Poverty Integration" };
      if (mapX === -1 && mapY === 0) return { title: "Portfolio", desc: "Value Addition Channels" };
      if (mapX === 0 && mapY === 0) return { title: "Financial Center", desc: "Horana Core Capital Asset" };
      if (mapX === 1 && mapY === 0) return { title: "SDG 8", desc: "Decent Corporate Work" };
      if (mapX === -1 && mapY === 1) return { title: "Momentum", desc: "Export Expansion" };
      if (mapX === 0 && mapY === 1) return { title: "Value Asset", desc: "Crop Investment" };
      return { title: "Resiliency", desc: "Global Estate Trade Network" };
    }
    if (face === "right") {
      if (mapX === -1 && mapY === -1) return { title: "SDG 2", desc: "Zero Hunger Logistics" };
      if (mapX === 0 && mapY === -1) return { title: "Factory 3.0", desc: "Estate Modernization" };
      if (mapX === 1 && mapY === -1) return { title: "SDG 6", desc: "Clean Estate Water" };
      if (mapX === -1 && mapY === 0) return { title: "SDG 7", desc: "Clean Local Energy" };
      if (mapX === 0 && mapY === 0) return { title: "Structure Center", desc: "Factory & Processing Hub" };
      if (mapX === 1 && mapY === 0) return { title: "SDG 9", desc: "Agrarian Innovation" };
      if (mapX === -1 && mapY === 1) return { title: "SDG 12", desc: "Sustainable Consumption" };
      if (mapX === 0 && mapY === 1) return { title: "Solar PV", desc: "Plantation Utility Grids" };
      return { title: "Efficiency", desc: "Manufacturing Operational Scale" };
    }
    if (face === "top") {
      if (mapX === -1 && mapY === -1) return { title: "Agronomy R&D", desc: "Climatic Resilient Variants" };
      if (mapX === 0 && mapY === -1) return { title: "SDG 4", desc: "Estate Education & Training" };
      if (mapX === 1 && mapY === -1) return { title: "SDG 8", desc: "Information Logistics Matrix" };
      if (mapX === -1 && mapY === 0) return { title: "SDG 9", desc: "Plantation Tech Nodes" };
      if (mapX === 0 && mapY === 0) return { title: "Intellectual Center", desc: "Agrarian Patent Hub" };
      if (mapX === 1 && mapY === 0) return { title: "SDG 12", desc: "Lean Farming Protocols" };
      if (mapX === -1 && mapY === 1) return { title: "SDG 17", desc: "Global Agronomy Partners" };
      if (mapX === 0 && mapY === 1) return { title: "Precision", desc: "Satellite Crop Telemetry" };
      return { title: "Agronomy", desc: "Breeding & Cultivation Intel" };
    }
    if (face === "left") {
      if (mapX === -1 && mapY === -1) return { title: "SDG 1", desc: "Worker Housing Welfare" };
      if (mapX === 0 && mapY === -1) return { title: "SDG 3", desc: "Medical Care Access" };
      if (mapX === 1 && mapY === -1) return { title: "SDG 4", desc: "Field Training Academy" };
      if (mapX === -1 && mapY === 0) return { title: "SDG 5", desc: "Estate Gender Parity" };
      if (mapX === 0 && mapY === 0) return { title: "Human Center", desc: "Estate Human Welfare Hub" };
      if (mapX === 1 && mapY === 0) return { title: "SDG 8", desc: "Estate Worker Stewardship" };
      if (mapX === -1 && mapY === 1) return { title: "Community", desc: "Family Living Assets" };
      if (mapX === 0 && mapY === 1) return { title: "Well-being", desc: "Staff Nutritional Security" };
      return { title: "Progress", desc: "Workforce Lifespan Growth" };
    }
    if (face === "bottom") {
      if (mapX === -1 && mapY === -1) return { title: "SDG 2", desc: "Food Cooperative Chains" };
      if (mapX === 0 && mapY === -1) return { title: "SDG 5", desc: "Women Outreach Panels" };
      if (mapX === 1 && mapY === -1) return { title: "SDG 8", desc: "Fair plantation growth" };
      if (mapX === -1 && mapY === 0) return { title: "SDG 10", desc: "Estate Wealth Equity" };
      if (mapX === 0 && mapY === 0) return { title: "Social Center", desc: "Stakeholder Relations" };
      if (mapX === 1 && mapY === 0) return { title: "Outgrowers", desc: "Smallholder Cooperatives" };
      if (mapX === -1 && mapY === 1) return { title: "Trust Ledger", desc: "Fairtrade Supply Audits" };
      if (mapX === 0 && mapY === 1) return { title: "Stakeholders", desc: "Public plantation dialogue" };
      return { title: "Dialogue", desc: "Estate Integration Synergy" };
    }
    if (face === "back") {
      if (mapX === -1 && mapY === -1) return { title: "SDG 7", desc: "Mini-Hydro Renewable Mix" };
      if (mapX === 0 && mapY === -1) return { title: "SDG 12", desc: "Circular Water Management" };
      if (mapX === 1 && mapY === -1) return { title: "SDG 13", desc: "Carbon Footprint Inversion" };
      if (mapX === -1 && mapY === 0) return { title: "SDG 14", desc: "Catchment Protection Silt traps" };
      if (mapX === 0 && mapY === 0) return { title: "Natural Center", desc: "Ecosystem Conservation" };
      if (mapX === 1 && mapY === 0) return { title: "SDG 15", desc: "Forest Connectivity Belts" };
      if (mapX === -1 && mapY === 1) return { title: "Soil Renewal", desc: "Organic Biochar Compost" };
      if (mapX === 0 && mapY === 1) return { title: "Water Flow", desc: "Stream Bank Re-wilding" };
      return { title: "Carbon Sink", desc: "Forest Canopy Conservation" };
    }
    return { title: "Capital Panel", desc: "Horana Sustainability Pillar" };
  };

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  // Close helper to return back to the beginning of the entire system (scroll top + index 0)
  const handleCloseSandboxSystem = () => {
    resetPuzzle();
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActiveSectionIndex(0);
    setScrollProgress(0);
    onClose();
  };

  // Initialize Rubik's puzzle structure
  const resetPuzzle = () => {
    const list: Cubie[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue; // Inner core empty
          
          list.push({
            id: `k-${x}-${y}-${z}`,
            x, y, z,
            origX: x,
            origY: y,
            origZ: z,
            faces: {
              front: "front",
              back: "back",
              left: "left",
              right: "right",
              top: "top",
              bottom: "bottom"
            }
          });
        }
      }
    }
    setCubies(list);
    setMoves(0);
    setSeconds(0);
    setCountdownSeconds(180);
    setGameOverTimeOut(false);
    setIsActive(false);
    setSolved(false);
    setMoveHistory([]);
    setSolvedStack([]);
    setIsAiSupportActive(false);
    setDismissCelebration(false);
    setActiveTurn(null);
    setSelectedSticker(null);
    playChirp(440, 0.15);
  };

  useEffect(() => {
    if (isOpen) {
      resetPuzzle();
    }
  }, [isOpen]);

  // Handle active game timer
  useEffect(() => {
    let interval: any = null;
    if (isActive && !solved && !gameOverTimeOut) {
      interval = setInterval(() => {
        if (countdownMode) {
          setCountdownSeconds((prev) => {
            if (prev <= 1) {
              setGameOverTimeOut(true);
              setIsActive(false);
              playChirp(200, 0.5);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, solved, countdownMode, gameOverTimeOut]);

  // Sound Synth Generator via Web Audio API
  const playChirp = (frequency = 600, duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 0.7, ctx.currentTime + duration);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // browser block catch silently
    }
  };

  // Logical coordinate movement & face permutation updates
  const commitTurn = (axis: "x" | "y" | "z", layerValue: number, clockwise: boolean) => {
    setCubies((prevCubies) => {
      return prevCubies.map((c) => {
        const matchesCoord = (axis === "x" && c.x === layerValue) ||
                             (axis === "y" && c.y === layerValue) ||
                             (axis === "z" && c.z === layerValue);

        if (!matchesCoord) return c;

        // 1. Calculate new 3D grid coordinate positions around rotation axis
        let nx = c.x;
        let ny = c.y;
        let nz = c.z;

        if (axis === "x") {
          if (clockwise) {
            ny = c.z;
            nz = -c.y;
          } else {
            ny = -c.z;
            nz = c.y;
          }
        } else if (axis === "y") {
          if (clockwise) {
            nx = -c.z;
            nz = c.x;
          } else {
            nx = c.z;
            nz = -c.x;
          }
        } else if (axis === "z") {
          if (clockwise) {
            nx = -c.y;
            ny = c.x;
          } else {
            nx = c.y;
            ny = -c.x;
          }
        }

        // 2. Permure physical faces correctly matching rotation kinematics
        const nextFaces = { ...c.faces };
        if (axis === "x") {
          if (clockwise) {
            nextFaces.top = c.faces.back;
            nextFaces.back = c.faces.bottom;
            nextFaces.bottom = c.faces.front;
            nextFaces.front = c.faces.top;
          } else {
            nextFaces.top = c.faces.front;
            nextFaces.front = c.faces.bottom;
            nextFaces.bottom = c.faces.back;
            nextFaces.back = c.faces.top;
          }
        } else if (axis === "y") {
          if (clockwise) {
            nextFaces.left = c.faces.front;
            nextFaces.back = c.faces.left;
            nextFaces.right = c.faces.back;
            nextFaces.front = c.faces.right;
          } else {
            nextFaces.front = c.faces.left;
            nextFaces.left = c.faces.back;
            nextFaces.back = c.faces.right;
            nextFaces.right = c.faces.front;
          }
        } else if (axis === "z") {
          if (clockwise) {
            nextFaces.top = c.faces.left;
            nextFaces.left = c.faces.bottom;
            nextFaces.bottom = c.faces.right;
            nextFaces.right = c.faces.top;
          } else {
            nextFaces.top = c.faces.right;
            nextFaces.right = c.faces.bottom;
            nextFaces.bottom = c.faces.left;
            nextFaces.left = c.faces.top;
          }
        }

        return {
          ...c,
          x: nx,
          y: ny,
          z: nz,
          faces: nextFaces
        };
      });
    });
  };

  // Perform smooth layer rotation with motion transition
  const rotateLayer = (axis: "x" | "y" | "z", layerValue: number, clockwise: boolean) => {
    if (activeTurn || scrambling) return;
    setIsActive(true);
    setMoves((m) => m + 1);
    
    // Play delightful mechanical transition sound
    playChirp(axis === "x" ? 640 : axis === "y" ? 560 : 600, 0.1);

    setActiveTurn({
      axis,
      layer: layerValue,
      clockwise
    });

    setMoveHistory((prev) => [...prev, { axis, layer: layerValue, clockwise }]);

    setSolvedStack((prev) => {
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (last.axis === axis && last.layer === layerValue && last.clockwise !== clockwise) {
          // Opposite operations on same layer cancel out!
          return prev.slice(0, -1);
        }
      }
      return [...prev, { axis, layer: layerValue, clockwise }];
    });
  };

  // Scramble the cube into an organic starting layout
  const handleScramble = async () => {
    if (scrambling || activeTurn) return;
    setScrambling(true);
    setSolved(false);
    setDismissCelebration(false);
    setMoves(0);
    setSeconds(0);
    setCountdownSeconds(180);
    setGameOverTimeOut(false);
    setIsActive(false);
    setSelectedSticker(null);

    let movesToMake = 12;
    if (scrambleDifficulty === "easy") movesToMake = 5;
    if (scrambleDifficulty === "hard") movesToMake = 25;

    const axes: ("x" | "y" | "z")[] = ["x", "y", "z"];
    const layers = [-1, 0, 1];

    const scrambleMoves: { axis: "x" | "y" | "z"; layer: number; clockwise: boolean }[] = [];

    for (let i = 0; i < movesToMake; i++) {
      const randAxis = axes[Math.floor(Math.random() * axes.length)];
      const randLayer = layers[Math.floor(Math.random() * layers.length)];
      const randDir = Math.random() > 0.5;

      commitTurn(randAxis, randLayer, randDir);
      scrambleMoves.push({ axis: randAxis, layer: randLayer, clockwise: randDir });
      await new Promise((res) => setTimeout(res, 60)); // Lightning fast snapping
    }

    setMoveHistory(scrambleMoves);
    setSolvedStack(scrambleMoves);
    setIsAiSupportActive(false);
    setScrambling(false);
    setIsActive(true);
    playChirp(820, 0.25);
  };

  // Keyboard support for expert Rubik maneuvers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || scrambling || activeTurn) return;
      const key = e.key.toLowerCase();
      
      if (e.key === "Escape") {
        setSelectedSticker(null);
        return;
      }

      // If sticker selection is active, arrow keys rotate layers instead of moving the camera
      if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
        if (selectedSticker) {
          e.preventDefault();
          const arrowDir = e.key === "ArrowLeft" ? "left" : e.key === "ArrowRight" ? "right" : e.key === "ArrowUp" ? "up" : "down";
          handleArrowRotation(arrowDir);
          return;
        } else {
          // Arrow keys turn camera views for 3D exploration
          if (e.key === "ArrowLeft") setCameraY((y) => y - 15);
          if (e.key === "ArrowRight") setCameraY((y) => y + 15);
          if (e.key === "ArrowUp") setCameraX((x) => Math.max(-80, x - 15));
          if (e.key === "ArrowDown") setCameraX((x) => Math.min(80, x + 15));
          return;
        }
      }

      // Top Face U, I
      if (key === "u") rotateLayer("y", -1, false); // Top Left
      if (key === "i") rotateLayer("y", -1, true);  // Top Right

      // Bottom Face D, C
      if (key === "d") rotateLayer("y", 1, false);  // Bottom Left
      if (key === "c") rotateLayer("y", 1, true);   // Bottom Right

      // Left Face L, K
      if (key === "l") rotateLayer("x", -1, false); // Left Face Left
      if (key === "k") rotateLayer("x", -1, true);  // Left Face Right

      // Right Face R, E
      if (key === "r") rotateLayer("x", 1, false);  // Right Face Left
      if (key === "e") rotateLayer("x", 1, true);   // Right Face Right

      // Front Face F, V
      if (key === "f") rotateLayer("z", 1, false);  // Front Face Left
      if (key === "v") rotateLayer("z", 1, true);   // Front Face Right

      // Back Face B, N
      if (key === "b") rotateLayer("z", -1, false); // Back Face Left
      if (key === "n") rotateLayer("z", -1, true);  // Back Face Right
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, scrambling, activeTurn, selectedSticker, cubies]);

  // Check if puzzle matches solution template (each exterior face displays uniform colors)
  useEffect(() => {
    if (cubies.length === 0 || moves === 0 || activeTurn) return;

    let isSolved = true;
    const faceKeys: FaceName[] = ["front", "back", "left", "right", "top", "bottom"];

    for (const fk of faceKeys) {
      const boundaryCubies = cubies.filter((c) => {
        if (fk === "front" && c.z === 1) return true;
        if (fk === "back" && c.z === -1) return true;
        if (fk === "left" && c.x === -1) return true;
        if (fk === "right" && c.x === 1) return true;
        if (fk === "top" && c.y === -1) return true;
        if (fk === "bottom" && c.y === 1) return true;
        return false;
      });

      if (boundaryCubies.length > 0) {
        const referenceFace = boundaryCubies[0].faces[fk];
        const matchAll = boundaryCubies.every((c) => c.faces[fk] === referenceFace);
        if (!matchAll) {
          isSolved = false;
          break;
        }
      }
    }

    if (isSolved && !solved) {
      setSolved(true);
      playChirp(980, 0.4);
    }
  }, [cubies, moves, solved, activeTurn]);

  // Orbit rotation dragging controls
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const dx = clientX - dragStartRef.current.x;
    const dy = clientY - dragStartRef.current.y;

    setCameraY((y) => y + dx * 0.55);
    setCameraX((x) => Math.max(-85, Math.min(85, x - dy * 0.55)));

    dragStartRef.current = { x: clientX, y: clientY };
  };

  const handleDragEnd = () => {
    dragStartRef.current = null;
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // High quality custom sticker rendering matching landing page's corporate grid patterns
  const renderSticker = (physicalFace: FaceName, c: Cubie) => {
    const logicalFace = c.faces[physicalFace];
    let mapX = c.origX;
    let mapY = c.origY;
    let mapZ = c.origZ;

    if (logicalFace === "top" || logicalFace === "bottom") {
      mapX = c.origX;
      mapY = c.origZ;
    } else if (logicalFace === "left" || logicalFace === "right") {
      mapX = c.origZ;
      mapY = c.origY;
    } else {
      mapX = c.origX;
      mapY = c.origY;
    }

    const isSelected = selectedSticker &&
                       selectedSticker.face === physicalFace &&
                       selectedSticker.x === c.x &&
                       selectedSticker.y === c.y &&
                       selectedSticker.z === c.z;

    const isAiTarget = isSelected && isAiSupportActive;

    return (
      <div 
        className={`w-[94%] h-[94%] rounded-xl overflow-hidden transition-all hover:brightness-110 shadow-[inset_0_2px_8px_rgba(255,255,255,0.15)] select-none flex items-center justify-center relative ${
          isAiTarget 
            ? "ring-4 ring-indigo-500 ring-offset-2 ring-offset-zinc-950 scale-[0.93] z-50 brightness-110 shadow-[0_0_25px_rgba(99,102,241,0.9)] animate-pulse"
            : isSelected 
              ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-zinc-950 scale-[0.93] z-50 brightness-110 shadow-[0_0_25px_rgba(251,191,36,0.9)]" 
              : ""
        }`}
      >
        <CubeSticker face={logicalFace} x={mapX} y={mapY} z={mapZ} />
        {isAiTarget ? (
          <div className="absolute inset-0 border-2 border-indigo-400 rounded-xl bg-indigo-500/20 pointer-events-none flex items-center justify-center">
            <span className="text-white font-mono text-[8px] font-black bg-indigo-950/90 px-1 py-0.5 rounded border border-indigo-400/50 shadow-sm leading-none animate-bounce">
              AI SUPPORT
            </span>
          </div>
        ) : isSelected ? (
          <div className="absolute inset-0 border-2 border-amber-300 rounded-xl bg-amber-400/10 pointer-events-none animate-pulse" />
        ) : null}
      </div>
    );
  };

  // Renders a single 3D physical block
  const renderCubie = (c: Cubie) => {
    const cubieSize = isMobileSize ? 58 : 75; 
    const halfSize = cubieSize / 2;
    const step = cubieSize + 4; // size + gap

    const translateStr = `translate3d(
      ${c.x * step}px,
      ${c.y * step}px,
      ${c.z * step}px
    )`;

    const faceBaseStyle: React.CSSProperties = {
      position: "absolute",
      width: `${cubieSize}px`,
      height: `${cubieSize}px`,
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      backgroundColor: "#0d0e0d", // Matte luxury bezel
      borderRadius: isMobileSize ? "8px" : "12px",
      border: isMobileSize ? "2px solid #020402" : "3.5px solid #020402",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "inset 0 0 10px rgba(0,0,0,0.85)"
    };

    return (
      <div
        key={c.id}
        className="absolute pointer-events-auto transform-gpu will-change-transform"
        style={{
          width: `${cubieSize}px`,
          height: `${cubieSize}px`,
          transformStyle: "preserve-3d",
          transform: translateStr,
          left: `calc(50% - ${halfSize}px)`,
          top: `calc(50% - ${halfSize}px)`,
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden"
        }}
      >
        {/* Top Face (y = -1) */}
        {c.y === -1 && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleStickerSelect("top", c.x, c.y, c.z);
            }}
            className="cursor-pointer"
            style={{ ...faceBaseStyle, transform: `translateY(${-halfSize}px) rotateX(90deg)` }}
          >
            {renderSticker("top", c)}
          </div>
        )}

        {/* Bottom Face (y = 1) */}
        {c.y === 1 && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleStickerSelect("bottom", c.x, c.y, c.z);
            }}
            className="cursor-pointer"
            style={{ ...faceBaseStyle, transform: `translateY(${halfSize}px) rotateX(-90deg)` }}
          >
            {renderSticker("bottom", c)}
          </div>
        )}

        {/* Left Face (x = -1) */}
        {c.x === -1 && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleStickerSelect("left", c.x, c.y, c.z);
            }}
            className="cursor-pointer"
            style={{ ...faceBaseStyle, transform: `translateX(${-halfSize}px) rotateY(-90deg)` }}
          >
            {renderSticker("left", c)}
          </div>
        )}

        {/* Right Face (x = 1) */}
        {c.x === 1 && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleStickerSelect("right", c.x, c.y, c.z);
            }}
            className="cursor-pointer"
            style={{ ...faceBaseStyle, transform: `translateX(${halfSize}px) rotateY(90deg)` }}
          >
            {renderSticker("right", c)}
          </div>
        )}

        {/* Front Face (z = 1) */}
        {c.z === 1 && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleStickerSelect("front", c.x, c.y, c.z);
            }}
            className="cursor-pointer"
            style={{ ...faceBaseStyle, transform: `translateZ(${halfSize}px)` }}
          >
            {renderSticker("front", c)}
          </div>
        )}

        {/* Back Face (z = -1) */}
        {c.z === -1 && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleStickerSelect("back", c.x, c.y, c.z);
            }}
            className="cursor-pointer"
            style={{ ...faceBaseStyle, transform: `translateZ(${-halfSize}px) rotateY(180deg)` }}
          >
            {renderSticker("back", c)}
          </div>
        )}
      </div>
    );
  };

  // Split cubies into moving and static sets for layer orbital grouping
  const rotatingCubies = activeTurn 
    ? cubies.filter((c) => {
        if (activeTurn.axis === "x" && c.x === activeTurn.layer) return true;
        if (activeTurn.axis === "y" && c.y === activeTurn.layer) return true;
        if (activeTurn.axis === "z" && c.z === activeTurn.layer) return true;
        return false;
      })
    : [];

  const staticCubies = activeTurn
    ? cubies.filter((c) => {
        if (activeTurn.axis === "x" && c.x === activeTurn.layer) return false;
        if (activeTurn.axis === "y" && c.y === activeTurn.layer) return false;
        if (activeTurn.axis === "z" && c.z === activeTurn.layer) return false;
        return true;
      })
    : cubies;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          id="rubik-game-modal" 
          onClick={(e) => e.stopPropagation()} 
          className="fixed inset-0 w-screen h-screen z-[99999] flex flex-col lg:flex-row bg-[#020503] select-none overflow-hidden font-sans"
        >
          
          {/* Left Side: Game HUD Sidebar (premium green-gold gradient theme with gold border accent) - hidden on mobile to maximize 3D canvas */}
          <div className="hidden lg:flex w-[350px] shrink-0 border-r border-[#C5A059]/30 p-8 flex-col justify-between bg-gradient-to-b from-[#031d0f] via-[#020d07] to-[#010402] z-10 relative animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#C5A059]" />

            <div>
              {/* Branding Title */}
              <div className="flex flex-col gap-1.5 font-display">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase font-bold">
                  <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
                  HPG 6 Capitals Strategy Game
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-white italic tracking-tight leading-none mt-1">
                  HPG <span className="text-[#C5A059] not-italic font-bold">6 Capitals Game</span>
                </h3>
                <p className="hidden sm:block text-[11px] text-zinc-400 leading-relaxed mt-2.5">
                  Realign the Horana Plantations corporate capitals. Each face of the Rubik's cube represents a core strategic asset! Match all 9 stickers per face to restore corporate harmony.
                </p>
              </div>

              {/* Status Board Widgets */}
              <div className="flex flex-row lg:flex-col gap-3 my-5">
                {/* Timer Widget */}
                <div className="flex-1 bg-black/45 border border-[#C5A059]/15 p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                    <Timer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none block">
                      {countdownMode ? "Time remaining" : "Timer elapsed"}
                    </span>
                    <span className={`text-sm sm:text-base font-mono font-bold block mt-0.5 ${countdownMode && countdownSeconds <= 30 ? "text-red-400 animate-pulse font-black" : "text-zinc-100"}`}>
                      {countdownMode ? formatTime(countdownSeconds) : formatTime(seconds)}
                    </span>
                  </div>
                </div>

                {/* Accuracy Moves Widget */}
                <div className="flex-1 bg-black/45 border border-[#C5A059]/15 p-3.5 rounded-2xl flex items-center gap-3 shadow-md">
                  <div className="p-2 bg-[#C5A059]/15 border border-[#C5A059]/30 rounded-xl text-[#C5A059]">
                    <Milestone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none block">
                      {gameMode === "challenge" ? "Turns Protocol" : "Rotation Turns"}
                    </span>
                    <span className="text-sm sm:text-base font-mono font-bold block mt-0.5 text-zinc-100">
                      <span className={gameMode === "challenge" && moves > 40 ? "text-red-400" : "text-zinc-100"}>
                        {moves}
                      </span>
                      {gameMode === "challenge" && (
                        <span className="text-[10px] text-zinc-500 ml-1">/40 max</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* High-end Collapsible Dashboard Tab System for Legenda, Options and Rules */}
              <div className="bg-black/35 rounded-2xl border border-[#C5A059]/15 p-1 flex flex-col overflow-hidden">
                {/* Collapsible Bar Header Trigger */}
                <button
                  onClick={() => {
                    setTabsExpanded(!tabsExpanded);
                    playChirp(600, 0.05);
                  }}
                  className="w-full flex items-center justify-between p-3 flex-row text-left hover:bg-white/5 transition-all focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider text-zinc-100 uppercase">
                      SYSTEM INDEX & OPTIONS
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase">
                      {tabsExpanded ? "COLLAPSE" : "EXPAND"}
                    </span>
                    <span className="text-[10px] text-[#C5A059] font-bold">
                      {tabsExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {tabsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="px-2.5 pb-3 pt-1.5 flex flex-col gap-3.5 border-t border-white/5"
                    >
                      {/* Tab Header pills */}
                      <div className="flex gap-1 bg-black/50 p-1 rounded-xl border border-white/5">
                        {[
                          { id: "portfolio", label: "PORTFOLIO" },
                          { id: "financials", label: "FINANCE" },
                          { id: "options", label: "OPTIONS" },
                          { id: "rules", label: "RULES" },
                          { id: "legend", label: "LEGEND" }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveSidebarTab(tab.id as any);
                              playChirp(700, 0.05);
                            }}
                            className={`flex-1 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                              activeSidebarTab === tab.id
                                ? "bg-[#C5A059] text-black shadow-md"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content 0: Corporate Showcase Channel */}
                      {activeSidebarTab === "portfolio" && (
                        <div className="animate-fadeIn">
                          <CubeCorporateShowcase />
                        </div>
                      )}

                      {activeSidebarTab === "financials" && (
                        <div className="animate-fadeIn">
                          <TenYearSummaryDashboard variant="compact" defaultCategory="operating" defaultMetricId="revenue" />
                        </div>
                      )}

                      {/* Tab Content 1: System Options */}
                      {activeSidebarTab === "options" && (
                        <div className="flex flex-col gap-3.5 text-[11px] animate-fadeIn">
                          {/* Game Mode Selector */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] font-mono font-bold text-[#C5A059] tracking-wider uppercase">Strategy Game Mode:</span>
                            <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
                              <button
                                onClick={() => { setGameMode("free"); playChirp(500, 0.05); }}
                                className={`py-1 rounded text-[9px] font-mono font-bold tracking-wider transition-all ${
                                  gameMode === "free"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                                }`}
                              >
                                Endless Free
                              </button>
                              <button
                                onClick={() => { setGameMode("challenge"); playChirp(600, 0.05); }}
                                className={`py-1 rounded text-[9px] font-mono font-bold tracking-wider transition-all ${
                                  gameMode === "challenge"
                                    ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30"
                                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                                }`}
                              >
                                40 Turns Limit
                              </button>
                            </div>
                          </div>

                          {/* Scramble Difficulty Selector */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[8px] font-mono font-bold text-[#C5A059] tracking-wider uppercase">Scramble Complexity:</span>
                            <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                              {[
                                { id: "easy", label: "EASY (5)" },
                                { id: "medium", label: "MED (12)" },
                                { id: "hard", label: "HARD (25)" }
                              ].map((d) => (
                                <button
                                  key={d.id}
                                  onClick={() => { setScrambleDifficulty(d.id as any); playChirp(520, 0.05); }}
                                  className={`py-1 rounded text-[8.5px] font-mono font-bold tracking-wide transition-all ${
                                    scrambleDifficulty === d.id
                                      ? "bg-[#C5A059] text-black"
                                      : "text-zinc-500 hover:text-zinc-300"
                                  }`}
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Time Countdown Strategy Switch */}
                          <div className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 font-mono">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-sans font-bold text-zinc-300">Countdown Limit</span>
                              <span className="text-[8.5px] font-sans text-zinc-500">3 Min Expiry Law</span>
                            </div>
                            <button
                              onClick={() => { setCountdownMode(!countdownMode); playChirp(580, 0.05); }}
                              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
                                countdownMode ? "bg-[#C5A059] justify-end" : "bg-zinc-800 justify-start"
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full shadow-md transition-all ${
                                countdownMode ? "bg-black" : "bg-zinc-400"
                              }`} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Tab Content 2: Boardroom Rules */}
                      {activeSidebarTab === "rules" && (
                        <div className="flex flex-col gap-2.5 text-[10px] text-zinc-400 font-sans leading-relaxed max-h-[160px] overflow-y-auto pr-1 animate-fadeIn">
                          <div className="flex gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-black">01.</span>
                            <p><strong>Strategic Equilibrium:</strong> Each side of the 3D cube showcases a completely unified color, capital model, and icon across all 9 panels.</p>
                          </div>
                          <div className="flex gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-black">02.</span>
                            <p><strong>Infinite Rotations:</strong> In Free Strategy options, you can rotate any face as much as you want endlessly without constraints.</p>
                          </div>
                          <div className="flex gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-black">03.</span>
                            <p><strong>Efficiency Rating:</strong> Enter Challenge mode to maintain the corporate balance sheet within a strict 40-turns threshold.</p>
                          </div>
                          <div className="flex gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-black">04.</span>
                            <p><strong>Alignment Solved:</strong> Celebrate alignment upon restoration. If needed, simply close celebration to continue free exploration rotations!</p>
                          </div>
                        </div>
                      )}

                      {/* Tab Content 3: Capitals Legend (Collapsible and rich) */}
                      {activeSidebarTab === "legend" && (
                        <div className="flex flex-col gap-2 text-[9.5px] max-h-[160px] overflow-y-auto pr-1 animate-fadeIn">
                          {Object.entries(BRAND_COLORS).map(([key, item]) => {
                            const Icon = item.icon;
                            return (
                              <div key={key} className="flex items-center justify-between bg-black/25 p-1.5 rounded-lg border border-white/5 gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="w-2.5 h-2.5 rounded shrink-0 shadow-sm" style={{ backgroundColor: item.hex }} />
                                  <span className="font-mono font-bold text-white uppercase tracking-wider shrink-0">[{item.label}]</span>
                                  <span className="truncate text-zinc-400 text-[8.5px]">{item.name}</span>
                                </div>
                                <Icon className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Decorative Divider System delivering high-end aesthetic gap requested by user */}
            <div className="my-7 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-dashed border-[#C5A059]/20" />
              </div>
              <span className="relative px-3 bg-[#020d07] text-[8px] font-mono tracking-widest text-[#C5A059] uppercase font-bold">
                Control Console
              </span>
            </div>

            {/* Core Action buttons Layout */}
            <div className="flex flex-col gap-4">
              <button
                onClick={handleScramble}
                disabled={scrambling || !!activeTurn}
                className="w-full py-3.5 px-4 rounded-xl bg-[#C5A059] hover:bg-[#b08b47] active:scale-95 text-black text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[0_10px_20px_rgba(197,160,89,0.15)] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <Shuffle className={`w-4 h-4 ${scrambling ? "animate-spin" : ""}`} />
                {scrambling ? "Scrambling..." : "Scramble Capitals"}
              </button>

              <button
                onClick={resetPuzzle}
                disabled={scrambling || !!activeTurn}
                className="w-full py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 text-zinc-300 text-xs font-mono tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
                Reset System State
              </button>

              <button
                onClick={() => {
                  if (solved || solvedStack.length === 0) {
                    playChirp(330, 0.15);
                    return;
                  }
                  const nextVal = !isAiSupportActive;
                  setIsAiSupportActive(nextVal);
                  if (nextVal) {
                    setAiIntroModal(true);
                  }
                  playChirp(680, 0.15);
                }}
                disabled={scrambling || !!activeTurn || solved || solvedStack.length === 0}
                className={`w-full py-3.5 px-4 rounded-xl border text-xs font-mono font-bold tracking-widest uppercase transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-30 shadow-md ${
                  isAiSupportActive 
                    ? "bg-indigo-950/50 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.25)]" 
                    : "bg-zinc-900/60 border-white/10 text-indigo-300 hover:border-indigo-500/40 hover:bg-indigo-950/20 hover:text-white"
                }`}
                title="Activates step-by-step mathematical AI guide to synchronize and solve the cube"
              >
                <Sparkles className={`w-4 h-4 ${isAiSupportActive ? "animate-pulse text-indigo-400" : "text-indigo-400"}`} />
                {solved || solvedStack.length === 0
                  ? "AI Support (System Synced)"
                  : isAiSupportActive 
                    ? "Deactivate AI Support" 
                    : "Engage AI Support"}
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-full py-2.5 px-3 rounded-lg border text-[10.5px] font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  soundEnabled 
                    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                    : "border-white/5 bg-transparent text-zinc-500"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                Synth Audio: {soundEnabled ? "On" : "Muted"}
              </button>
            </div>
          </div>

          {/* Right Side: High-end 3D Game Field, strictly Fullscreen with elegant animated mesh & gold spot glows */}
          <div className="flex-grow flex flex-col relative overflow-hidden bg-gradient-to-tr from-[#010402] via-[#02180c] to-[#010301]">
            
            {/* Mobile-Only Top Nav Bar */}
            <div className="lg:hidden flex items-center justify-between w-full h-14 bg-zinc-950/90 border-b border-[#C5A059]/20 px-4 z-25 backdrop-blur-md shrink-0 select-none">
              {/* Left: Brand/Logo */}
              <div className="flex items-center gap-1.5 font-display">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                <span className="text-xs font-serif italic font-bold text-white tracking-wide">
                  HPG <span className="text-[#C5A059] font-bold not-italic">Capitals</span>
                </span>
              </div>

              {/* Center: Live Consolidated Metrics */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/5 py-1 px-2.5 rounded-xl text-[10px] font-mono leading-none">
                <div className="flex items-center gap-1 shrink-0">
                  <Timer className="w-3 h-3 text-emerald-400" />
                  <span className={countdownMode && countdownSeconds <= 30 ? "text-red-400 font-extrabold animate-pulse" : "text-zinc-200"}>
                    {countdownMode ? formatTime(countdownSeconds) : formatTime(seconds)}
                  </span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-1 shrink-0">
                  <Milestone className="w-3 h-3 text-[#C5A059]" />
                  <span className="text-[#C5A059] font-bold">{moves}</span>
                  {gameMode === "challenge" && <span className="text-zinc-500 scale-90">/40</span>}
                </div>
              </div>

              {/* Right: Actions and Dropdowns */}
              <div className="flex items-center gap-2">
                {/* Audio Button */}
                <button
                  onClick={() => {
                    setSoundEnabled(!soundEnabled);
                    playChirp(soundEnabled ? 300 : 600, 0.05);
                  }}
                  className={`p-1.5 rounded-lg border transition-all active:scale-95 ${soundEnabled ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" : "border-white/5 bg-transparent text-zinc-500"}`}
                  title="Toggle Audio Synth"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>

                {/* Mobile Options Trigger drawer-sheet */}
                <button
                  onClick={() => {
                    setMobileOptionsOpen(true);
                    playChirp(700, 0.05);
                  }}
                  className="p-1.5 rounded-lg border border-[#C5A059]/30 bg-black/45 text-[#C5A059] active:scale-95 transition-all animate-pulse"
                  title="System Options Indicator"
                >
                  <Sliders className="w-3.5 h-3.5" />
                </button>

                {/* Exit Button */}
                <button
                  onClick={() => {
                    playChirp(440, 0.1);
                    setShowExitConfirm(true);
                  }}
                  className="p-1.5 rounded-lg bg-red-600/10 border border-red-500/40 text-red-100 hover:bg-red-500 hover:text-black active:scale-95 transition-all"
                  title="Exit Simulation"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Ambient luxury glows */}
            <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#C5A059]/15 blur-[130px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />
            <div className="absolute top-[35%] right-[20%] w-[35%] h-[35%] rounded-full bg-[#14B8A6]/10 blur-[110px] pointer-events-none" />
            
            {/* Elegant tea plantation aesthetic subtle vector mesh layout */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.035)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_90%,transparent_100%)] pointer-events-none opacity-50" />
            
            {/* Top Bar for Action controllers & high value Close widget (Desktop-Only) */}
            <div className="hidden lg:flex absolute top-4 sm:top-6 inset-x-4 sm:inset-x-6 justify-between items-center z-20 pointer-events-none">
              <div className="flex gap-2 pointer-events-auto font-display">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-black/85 border border-[#C5A059]/35 hover:border-[#C5A059] text-zinc-300 hover:text-white transition-all cursor-pointer text-[10px] sm:text-xs font-mono tracking-widest uppercase flex items-center gap-1.5 sm:gap-2 shadow-lg backdrop-blur-md"
                >
                  <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#C5A059]" />
                  <span className="hidden xs:inline">Playbook Manual</span>
                  <span className="xs:hidden">Manual</span>
                </button>
              </div>

               {/* Close Button styling requested by user to exit fullscreen correctly with custom confirmation flow */}
              <button
                onClick={() => {
                  playChirp(440, 0.1);
                  setShowExitConfirm(true);
                }}
                className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-red-600/10 hover:bg-red-500 hover:text-black border-2 border-red-500/40 hover:border-red-500 text-red-400 font-mono text-[10px] sm:text-xs tracking-widest uppercase transition-all duration-300 cursor-pointer pointer-events-auto flex items-center gap-1.5 sm:gap-2 shadow-2xl backdrop-blur-md relative overflow-hidden group"
                aria-label="Exit Game Modal"
              >
                {/* Visual pulse glow inside button */}
                <span className="absolute inset-0 bg-red-500/10 opacity-50 group-hover:opacity-0 transition-opacity" />
                <span className="absolute -top-12 -left-12 w-24 h-24 bg-red-500/20 rounded-full blur-xl group-hover:bg-transparent" />
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 group-hover:text-black relative z-10 animate-pulse group-hover:animate-none" />
                <span className="relative z-10 font-bold hidden xs:inline tracking-[0.15em]">Exit Simulation</span>
                <span className="relative z-10 font-bold xs:hidden">Exit</span>
              </button>
            </div>

            {/* Responsive 3D Canvas space */}
            <div 
              className="flex-grow flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none overflow-hidden touch-none"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={handleDragStart}
              onTouchMove={handleDragMove}
              onTouchEnd={handleDragEnd}
            >
              {/* Massive ambient decorative telemetry design rings behind the 3D cube */}
              <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-20 pointer-events-none transform scale-125">
                <div className="w-[600px] h-[600px] rounded-full border border-dashed border-[#C5A059]/30 animate-spin" style={{ animationDuration: "140s" }}></div>
                <div className="w-[450px] h-[450px] rounded-full border border-dashed border-emerald-500/30 absolute animate-spin" style={{ animationDuration: "70s", animationDirection: "reverse" }}></div>
                <div className="w-[300px] h-[300px] rounded-full border border-white/5 absolute" />
              </div>

              {/* Perspective Assembly stage */}
              <div 
                className="relative w-[240px] h-[240px] xs:w-[280px] xs:h-[280px] sm:w-[420px] sm:h-[420px] flex items-center justify-center pointer-events-none -translate-y-20 sm:-translate-y-24 lg:translate-y-0 transition-transform duration-500"
                style={{
                  perspective: "1500px",
                  transformStyle: "preserve-3d"
                }}
              >
                <div
                  className="w-full h-full relative flex items-center justify-center transform-gpu"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${cameraX}deg) rotateY(${cameraY}deg)`,
                    transition: scrambling ? "none" : "transform 250ms ease-out"
                  }}
                >
                  {/* Stable Flat Static Cubies */}
                  {staticCubies.map((c) => renderCubie(c))}

                  {/* Dynamic Smooth Orbital Wrapper for Rotating Layers */}
                  {activeTurn && (
                    <motion.div
                      key={`${activeTurn.axis}-${activeTurn.layer}-${activeTurn.clockwise}`}
                      initial={{ rotateX: 0, rotateY: 0, rotateZ: 0 }}
                      animate={{
                        rotateX: activeTurn.axis === "x" ? (activeTurn.clockwise ? -90 : 90) : 0,
                        rotateY: activeTurn.axis === "y" ? (activeTurn.clockwise ? -90 : 90) : 0,
                        rotateZ: activeTurn.axis === "z" ? (activeTurn.clockwise ? 90 : -90) : 0,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.16, 1, 0.3, 1] // Fluid high-end easeOut curve
                      }}
                      onAnimationComplete={() => {
                        const { axis, layer, clockwise } = activeTurn;
                        commitTurn(axis, layer, clockwise);
                        setActiveTurn(null);
                      }}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        transformStyle: "preserve-3d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      {rotatingCubies.map((c) => renderCubie(c))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Ambient Solved Victory Card Overlay */}
              <AnimatePresence>
                {solved && !dismissCelebration && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#020704]/98 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 text-center z-30 font-display animate-in fade-in duration-300"
                  >
                    {/* Professional Luxury Framework Container */}
                    <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#06170d] to-[#010502] border-2 border-[#C5A059] rounded-3xl p-5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col items-center">
                      
                      {/* Close button in top-right corner of the victory card so the client has multiple ways to leave */}
                      <button
                        onClick={handleCloseSandboxSystem}
                        className="absolute top-4 right-4 p-2 rounded-full border border-[#C5A059]/20 hover:border-[#C5A059] text-zinc-400 hover:text-white transition-all cursor-pointer bg-black/40"
                        title="Close gane modal"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Golden Crown Badge and Alignment Title */}
                      <div className="flex flex-col items-center mb-3 sm:mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-b from-[#C5A059]/20 to-[#C5A059]/5 border border-[#C5A059] rounded-full flex items-center justify-center text-[#C5A059] mb-2 sm:mb-3 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                          <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        
                        <span className="text-[8px] sm:text-[10px] font-mono leading-none tracking-[0.4em] font-black text-[#C5A059] uppercase block text-center">
                          Ceylon Tea Plantation Governance
                        </span>
                        
                        <h4 className="text-xl sm:text-3xl lg:text-4xl font-serif text-white font-bold italic tracking-tight leading-none mt-1 sm:mt-2">
                          Capitals Aligned Successfully
                        </h4>
                      </div>

                      {/* High-end decorative certificate text */}
                      <p className="text-zinc-300 font-sans text-[11px] sm:text-xs max-w-lg leading-relaxed px-2 sm:px-4">
                        Outstanding management. The Rubik's assembly has reached perfect equilibrium. All six strategic corporate pillars are synchronized and working in harmony.
                      </p>

                      {/* Score Metrics section styled like a premium dashboard widget */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md my-3 sm:my-5 bg-black/50 p-3 sm:p-4 rounded-2xl border border-white/5 shadow-inner">
                        <div className="text-center">
                          <span className="text-[8px] sm:text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">Audit Elapsed Time</span>
                          <span className="text-lg sm:text-2xl font-mono font-black text-emerald-400 mt-0.5 sm:mt-1 block">
                            {formatTime(seconds)}
                          </span>
                        </div>
                        <div className="text-center border-l border-white/5">
                          <span className="text-[8px] sm:text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest block">Optimized Turns</span>
                          <span className="text-lg sm:text-2xl font-mono font-black text-[#C5A059] mt-0.5 sm:mt-1 block">
                            {moves} Rounds
                          </span>
                        </div>
                      </div>

                      {/* Structured Matrix Checklist representation of aligned Capitals */}
                      <div className="w-full max-w-md grid grid-cols-2 gap-2 text-left mb-5 sm:mb-8 text-[11px]">
                        {[
                          { label: "[FIN]", name: "Financial Momentum", val: "SYNCD", color: "#EF4444" },
                          { label: "[NAT]", name: "Natural Biodiversity", val: "SYNCD", color: "#10B981" },
                          { label: "[HUM]", name: "Human Development", val: "SYNCD", color: "#F97316" },
                          { label: "[MFG]", name: "Factory Integration", val: "SYNCD", color: "#71717A" },
                          { label: "[INT]", name: "Agronomy Intelligence", val: "SYNCD", color: "#06B6D4" },
                          { label: "[SOC]", name: "Community Synergy", val: "SYNCD", color: "#4F46E5" },
                        ].map((item, key) => (
                          <div key={key} className="bg-black/30 border border-white/5 p-1.5 sm:p-2 rounded-xl flex items-center justify-between gap-1 shadow-sm">
                            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                              <div className="truncate">
                                <span className="font-mono text-white block text-[9px] sm:text-[9.5px] leading-tight font-black">{item.label}</span>
                                <span className="text-[7.5px] sm:text-[8.5px] text-zinc-500 block leading-tight truncate">{item.name}</span>
                              </div>
                            </div>
                            <span className="text-[7.5px] sm:text-[8px] font-mono font-bold leading-none px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                              {item.val}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Main workspace buttons - beautifully spaced, responsive & modern */}
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg font-mono text-xs font-bold mt-4">
                        {/* KEEP MOUNTED SANDBOX BUTTON - ROTATE AS MUCH AS THEY WANT */}
                        <button
                          id="keep-rotating-btn"
                          onClick={() => {
                            setDismissCelebration(true);
                            playChirp(800, 0.15);
                          }}
                          className="flex-1 py-3 sm:py-3.5 px-4 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Compass className="w-4 h-4 text-[#C5A059]" />
                          <span>Keep Rotating</span>
                        </button>

                        {/* PLAY AGAIN RESET BUTTON */}
                        <button
                          id="re-scramble-btn"
                          onClick={resetPuzzle}
                          className="flex-1 py-3 sm:py-3.5 px-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 hover:text-white border border-emerald-500/30 hover:border-emerald-500/50 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                        >
                          <RotateCcw className="w-4 h-4 text-emerald-400" />
                          <span>Re-Scramble</span>
                        </button>

                        {/* CLOSE SANDBOX MODAL (This is the critical requested button that closes the modal properly) */}
                        <button
                          id="close-sandbox-btn"
                          onClick={handleCloseSandboxSystem}
                          className="flex-1 py-3 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#b08b47] hover:to-[#C5A059] text-black active:scale-95 transition-all duration-200 shadow-[0_4px_15px_rgba(197,160,89,0.3)] cursor-pointer flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4 text-black" />
                          <span>Close Sandbox</span>
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timeout Game Over Overlay */}
              <AnimatePresence>
                {gameOverTimeOut && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 bg-red-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 font-display"
                  >
                    <div className="w-20 h-20 bg-red-500/15 border border-red-500/40 rounded-full flex items-center justify-center text-red-400 mb-6 relative">
                      <Timer className="w-10 h-10 animate-bounce" />
                    </div>
                    <h4 className="text-2xl font-serif text-red-400 font-bold tracking-widest">SYSTEM TIMEOUT!</h4>
                    <p className="text-zinc-300 font-sans text-xs max-w-sm mt-3 leading-relaxed">
                      The strategic alignment window expired before Horana corporate capitals could be fully synchronized.
                    </p>
                    <div className="flex gap-4 mt-8 font-mono text-xs font-bold">
                      <button
                        onClick={resetPuzzle}
                        className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-black uppercase tracking-wider transition-all cursor-pointer"
                      >
                        Re-Scramble State
                      </button>
                      <button
                        onClick={handleCloseSandboxSystem}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/15 text-zinc-300 uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
                      >
                        Exit Sandbox
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Exit Confirmation Dialog requested by user */}
              <AnimatePresence>
                {showExitConfirm && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#020503]/94 backdrop-blur-xl flex items-center justify-center p-4 z-[100000] font-sans"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 15 }}
                      transition={{ type: "spring", duration: 0.4 }}
                      className="relative w-full max-w-md bg-gradient-to-b from-[#0f0505] via-[#050101] to-[#020000] border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(239,68,68,0.25)] text-center font-display overflow-hidden"
                    >
                      {/* Abstract top golden-red warning light bar */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-[#C5A059] to-red-600 animate-pulse" />
                      
                      {/* Animated alert icon */}
                      <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/35 rounded-full flex items-center justify-center text-red-400 mb-5 relative group">
                        <span className="absolute inset-0 rounded-full border border-red-500/20 animate-ping opacity-75" />
                        <AlertTriangle className="w-8 h-8 text-red-500 animate-bounce" />
                      </div>

                      {/* Header and Title */}
                      <span className="text-[10px] font-mono leading-none tracking-[0.35em] font-black text-[#C5A059] uppercase block mb-1">
                        Ceylon Tea Plantation System
                      </span>
                      <h4 className="text-xl sm:text-2xl font-serif text-white font-bold italic tracking-tight leading-none mt-1">
                        Exit Simulation Game?
                      </h4>

                      {/* Beautiful message explaining reset state and return home */}
                      <p className="text-zinc-300 font-sans text-xs sm:text-sm mt-4 leading-relaxed">
                        Realigning the Horana corporate capitals is an active governance procedure. Exiting will abort your current state, reset aligned corporate pillars, and return to the home screen.
                      </p>
                      
                      <div className="mt-4 p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-[10.5px] font-mono text-red-500/90 leading-normal font-medium tracking-wide">
                        All active alignment progress will be cleared and restarted upon exiting the simulation.
                      </div>

                      {/* Decisive actions for the interactive user */}
                      <div className="flex flex-col gap-2.5 mt-6 font-mono text-xs font-bold">
                        {/* Yes exit - returns to home page top */}
                        <button
                          onClick={() => {
                            playChirp(150, 0.45);
                            setShowExitConfirm(false);
                            handleCloseSandboxSystem();
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-orange-500 text-white hover:text-black tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(239,68,68,0.3)] active:scale-95"
                        >
                          <LogOut className="w-4 h-4" />
                          Yes, Exit Simulation
                        </button>

                        {/* No, stay and align */}
                        <button
                          onClick={() => {
                            playChirp(600, 0.1);
                            setShowExitConfirm(false);
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          Cancel, Stay & Play
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Play Interactive Help Guide Drawer */}
              <AnimatePresence>
                {showHelp && (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="absolute right-0 inset-y-0 w-80 bg-[#050b07]/95 border-l border-[#C5A059]/30 p-8 z-30 flex flex-col justify-between backdrop-blur-md font-display"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-sm font-serif font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
                          <Keyboard className="w-4.5 h-4.5 text-[#C5A059]" />
                          Interactive Guide
                        </h4>
                        <button
                          onClick={() => setShowHelp(false)}
                          className="p-1.5 rounded-lg border border-white/5 hover:border-[#C5A059]/30 text-zinc-400 hover:text-white transition-all cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-5 font-sans text-[11px] leading-relaxed text-zinc-300">
                        <div>
                          <span className="font-mono text-[#C5A059] block uppercase tracking-wider font-semibold">Goal:</span>
                          <p className="text-zinc-400 mt-1">
                            Realign each side of the Rubik's Cube to match its designated color and capital, displaying unified panels and icons on each face.
                          </p>
                        </div>

                        <div>
                          <span className="font-mono text-[#C5A059] block uppercase tracking-wider font-semibold">Touch / Drag controls:</span>
                          <p className="text-zinc-400 mt-1">
                            Use your mouse or swipe anywhere in the dark canvas space inside the 3D grid area to freely rotate the workspace camera view.
                          </p>
                        </div>

                        <div>
                          <span className="font-mono text-[#C5A059] block uppercase tracking-wider font-semibold">Keyboard Control Mapping:</span>
                          <div className="space-y-2 mt-2 text-zinc-300 font-sans">
                            <p>
                              You can rotate rows easily using your physical <strong>Arrow Keys</strong>!
                            </p>
                            <ul className="space-y-1 my-2 text-zinc-300 font-mono pl-3 border-l-2 border-[#C5A059]/30">
                              <li className="flex items-start gap-1">
                                <span className="text-[#C5A059] font-black">1.</span>
                                <span>Click/select any <strong>3D Cube panel</strong> (sticker) to highlight it.</span>
                              </li>
                              <li className="flex items-start gap-1">
                                <span className="text-[#C5A059] font-black">2.</span>
                                <span>Press your keyboard's <strong>Arrow Keys</strong> (▲, ▼, ◀, ▶) to rotate the matching layer!</span>
                              </li>
                              <li className="flex items-start gap-1">
                                <span className="text-[#C5A059] font-black">3.</span>
                                <span>Press <strong>[Escape / ESC]</strong> anytime to deselect the active panel.</span>
                              </li>
                            </ul>
                            <p className="text-[10.5px] text-zinc-400 leading-normal pt-2 border-t border-white/5">
                              <strong>Orbit view:</strong> When no panel is active, pressing the **Arrow Keys** (or dragging with your mouse) orbits the 3D viewport camera to inspect other carbon/stewardship faces.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowHelp(false)}
                      className="w-full py-3 rounded-xl bg-[#C5A059] hover:bg-[#b08b47] text-black text-xs font-mono tracking-widest uppercase transition-all font-bold cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Point-and-Click / Swipe Selected Sticker Core Controllers */}
              <AnimatePresence>
                {selectedSticker && (
                  <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.93 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 25, scale: 0.93 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-lg bg-zinc-950/98 rounded-3xl p-4 sm:p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] border backdrop-blur-xl flex flex-col gap-4 pointer-events-auto overflow-hidden text-left"
                    style={(() => {
                      const activeCubie = cubies.find(
                        (cp) => cp.x === selectedSticker.x && cp.y === selectedSticker.y && cp.z === selectedSticker.z
                      );
                      const logicalFace = activeCubie ? activeCubie.faces[selectedSticker.face] : selectedSticker.face;
                      const brand = BRAND_COLORS[logicalFace];
                      return {
                        borderColor: `${brand.hex}70`,
                        boxShadow: `0 0 35px ${brand.hex}20, inset 0 0 20px ${brand.hex}08, 0 25px 60px rgba(0,0,0,0.85)`
                      };
                    })()}
                  >
                    {/* Brand top accent color indicator strip */}
                    {(() => {
                      const activeCubie = cubies.find(
                        (cp) => cp.x === selectedSticker.x && cp.y === selectedSticker.y && cp.z === selectedSticker.z
                      );
                      const logicalFace = activeCubie ? activeCubie.faces[selectedSticker.face] : selectedSticker.face;
                      const brand = BRAND_COLORS[logicalFace];
                      return (
                        <div 
                          className="absolute top-0 inset-x-0 h-1.5 transition-colors duration-300"
                          style={{ backgroundColor: brand.hex }}
                        />
                      );
                    })()}

                    {/* Quick Deselect Corner Button */}
                    <button
                      onClick={() => setSelectedSticker(null)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer z-10"
                      title="Deselect Spot (ESC)"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Main Content Layout with Auto-Responsive Splitting */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-5 mt-1">
                      {/* Left Side: Active sustainability capital details */}
                      {(() => {
                        const activeCubie = cubies.find(
                          (cp) => cp.x === selectedSticker.x && cp.y === selectedSticker.y && cp.z === selectedSticker.z
                        );
                        const logicalFace = activeCubie ? activeCubie.faces[selectedSticker.face] : selectedSticker.face;
                        const brand = BRAND_COLORS[logicalFace];
                        const label = activeCubie 
                          ? getStickerLabel(logicalFace, activeCubie.origX, activeCubie.origY, activeCubie.origZ)
                          : { title: "Strategic Capital Panel", desc: "Align corporate capital" };

                        return (
                          <div className="flex gap-4 items-start sm:items-center min-w-0 flex-1">
                            {/* Premium Icon Badge */}
                            <div 
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border relative"
                              style={{ 
                                background: `linear-gradient(135deg, ${brand.hex}15, ${brand.hex}30)`,
                                borderColor: `${brand.hex}60`,
                                boxShadow: `0 0 15px ${brand.hex}25`
                              }}
                            >
                              {React.createElement(brand.icon as React.ComponentType<any>, { 
                                className: "w-6 h-6 animate-pulse", 
                                color: brand.hex 
                              })}
                              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black font-mono text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center scale-90 border border-black shadow">
                                ★
                              </span>
                            </div>

                            {/* Captipils & Labels */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-zinc-400">
                                  Stewardship
                                </span>
                                <span 
                                  className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full leading-none uppercase tracking-wide border"
                                  style={{ 
                                    backgroundColor: `${brand.hex}25`, 
                                    color: brand.hex,
                                    borderColor: `${brand.hex}40`
                                  }}
                                >
                                  {brand.label}
                                </span>
                              </div>
                              <h5 className="text-white font-display font-black text-sm sm:text-base tracking-tight mt-1 leading-snug">
                                {label.title}
                              </h5>
                              <p className="text-[10px] text-zinc-400 leading-relaxed mt-1 font-sans line-clamp-2">
                                {label.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Right Side: High-End Core Controller Compass Dials */}
                      {(() => {
                        const activeCubie = cubies.find(
                          (cp) => cp.x === selectedSticker.x && cp.y === selectedSticker.y && cp.z === selectedSticker.z
                        );
                        const logicalFace = activeCubie ? activeCubie.faces[selectedSticker.face] : selectedSticker.face;
                        const brand = BRAND_COLORS[logicalFace];

                        return (
                          <div className="flex items-center gap-4 justify-end sm:justify-start shrink-0">
                            {/* Controller compass cluster */}
                            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center bg-black/40 border border-white/5 rounded-full p-1.5 shadow-inner">
                              {/* Left Dial */}
                              <button
                                onClick={() => handleArrowRotation("left")}
                                className="absolute left-1.5 w-6 h-6 bg-zinc-900 hover:bg-zinc-800 border rounded-full active:scale-90 transition-all flex items-center justify-center cursor-pointer text-xs font-black shadow-md"
                                style={{ borderColor: `${brand.hex}50`, color: brand.hex }}
                                title="Rotate Leftwards (◀)"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = brand.hex;
                                  e.currentTarget.style.boxShadow = `0 0 10px ${brand.hex}40`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = `${brand.hex}50`;
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                ◀
                              </button>

                              {/* Up Dial */}
                              <button
                                onClick={() => handleArrowRotation("up")}
                                className="absolute top-1.5 w-6 h-6 bg-zinc-900 hover:bg-zinc-800 border rounded-full active:scale-90 transition-all flex items-center justify-center cursor-pointer text-xs font-black shadow-md"
                                style={{ borderColor: `${brand.hex}50`, color: brand.hex }}
                                title="Rotate Upwards (▲)"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = brand.hex;
                                  e.currentTarget.style.boxShadow = `0 0 10px ${brand.hex}40`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = `${brand.hex}50`;
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                ▲
                              </button>

                              {/* Right Dial */}
                              <button
                                onClick={() => handleArrowRotation("right")}
                                className="absolute right-1.5 w-6 h-6 bg-zinc-900 hover:bg-zinc-800 border rounded-full active:scale-90 transition-all flex items-center justify-center cursor-pointer text-xs font-black shadow-md"
                                style={{ borderColor: `${brand.hex}50`, color: brand.hex }}
                                title="Rotate Rightwards (▶)"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = brand.hex;
                                  e.currentTarget.style.boxShadow = `0 0 10px ${brand.hex}40`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = `${brand.hex}50`;
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                ▶
                              </button>

                              {/* Down Dial */}
                              <button
                                onClick={() => handleArrowRotation("down")}
                                className="absolute bottom-1.5 w-6 h-6 bg-zinc-900 hover:bg-zinc-800 border rounded-full active:scale-90 transition-all flex items-center justify-center cursor-pointer text-xs font-black shadow-md"
                                style={{ borderColor: `${brand.hex}50`, color: brand.hex }}
                                title="Rotate Downwards (▼)"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = brand.hex;
                                  e.currentTarget.style.boxShadow = `0 0 10px ${brand.hex}40`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = `${brand.hex}50`;
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              >
                                ▼
                              </button>

                              {/* Center Core Esc Close representation */}
                              <button
                                onClick={() => setSelectedSticker(null)}
                                className="w-8 h-8 rounded-full bg-zinc-950 border border-red-500/30 hover:border-red-500 text-[8px] font-mono font-black text-red-500 tracking-wider flex items-center justify-center shadow-lg transition-all active:scale-95 cursor-pointer hover:bg-red-500/10"
                                title="Deselect active stewardship spot (ESC)"
                              >
                                ESC
                              </button>
                            </div>

                            {/* High fidelity arrows layout prompt */}
                            <div className="hidden xs:flex flex-col text-left font-mono leading-tight tracking-normal">
                              <div className="flex items-center gap-1">
                                <span className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 rounded text-[9px] text-[#C5A059] font-black">▲</span>
                                <span className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 rounded text-[9px] text-[#C5A059] font-black">▼</span>
                                <span className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 rounded text-[9px] text-[#C5A059] font-black">◀</span>
                                <span className="px-1.5 py-0.5 bg-zinc-900 border border-white/5 rounded text-[9px] text-[#C5A059] font-black">▶</span>
                              </div>
                              <span className="text-[8px] text-zinc-500 font-sans mt-1">Press physical Arrow Keys!</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* INTERACTIVE STEP-BY-STEP ONBOARDING TUTORIAL WORKSPACE OVERLAY */}
              <AnimatePresence>
                {tutorialActive && (
                  <div className="absolute inset-0 z-[45] pointer-events-none">
                    
                    {/* Dark back curtains for step 1 to draw pristine focused attention */}
                    {tutorialStep === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
                      />
                    )}

                    {/* Glow indicators / spotlights pointing to targeted interactive points */}
                    {tutorialStep === 2 && (
                      <div className="absolute inset-x-0 top-[20%] bottom-[20%] flex items-center justify-center">
                        <div className="relative w-[300px] h-[300px] pointer-events-none">
                          <span className="absolute inset-0 rounded-full border-2 border-dashed border-[#C5A059] animate-ping opacity-60" style={{ animationDuration: "3s" }} />
                          <span className="absolute -inset-4 rounded-full border border-dashed border-[#C5A059]/30 animate-pulse" />
                        </div>
                      </div>
                    )}

                    {tutorialStep === 3 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-lg h-36 border-2 border-[#C5A059] rounded-3xl animate-pulse pointer-events-none" style={{ boxShadow: "0 0 30px rgba(197, 160, 89, 0.4)" }} />
                    )}

                    {/* Step Card Components */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      {tutorialStep === 1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 15 }}
                          className="bg-gradient-to-b from-[#0b2414] via-[#020d06]/98 to-[#010502] border-2 border-[#C5A059] rounded-[32px] p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-[0_25px_60px_rgba(0,0,0,0.95)] pointer-events-auto text-center relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#C5A059] via-[#E5C079] to-[#C5A059] animate-pulse" />
                          <div className="mx-auto w-16 h-16 bg-[#C5A059]/10 border-2 border-dashed border-[#C5A059]/30 rounded-full flex items-center justify-center text-[#C5A059] mb-4 shadow-[0_0_20px_rgba(197,160,89,0.2)]">
                            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
                          </div>
                          
                          <span className="text-[10px] font-mono tracking-[0.3em] text-[#C5A059] uppercase block font-bold bg-[#C5A059]/10 rounded-full px-3 py-1 w-fit mx-auto mb-2.5 animate-pulse">
                            🎮 Interactive Strategy Game
                          </span>
                          
                          <h4 className="text-2xl font-serif text-white italic font-bold tracking-tight">
                            HPG 6 Capitals Challenge
                          </h4>
                          
                          <p className="text-zinc-300 font-sans text-xs leading-relaxed mt-4">
                            Welcome Player! This is a highly strategic alignment game. Your mission is to synchronize Horana Plantations' core sustainable capitals by matching the color stickers across the rotating 3D Rubik's matrix. Play now to realign stewardship blocks!
                          </p>

                          <div className="flex flex-col gap-2 mt-6 font-mono text-xs font-bold">
                            <button
                              onClick={() => {
                                playChirp(680, 0.1);
                                setTutorialStep(2);
                              }}
                              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C079] hover:from-[#b08b47] hover:to-[#C5A059] text-black tracking-wider uppercase transition-all duration-300 shadow-[0_4px_15px_rgba(197,160,89,0.4)] active:scale-95 cursor-pointer text-xs"
                            >
                              🕹️ Play Gamified Challenge ➔
                            </button>
                            <button
                              onClick={() => {
                                playChirp(330, 0.05);
                                setTutorialActive(false);
                                localStorage.setItem("capitalsCubeTutorialCompleted", "completed");
                              }}
                              className="w-full py-2.5 rounded-xl hover:bg-white/5 border border-white/10 text-zinc-400 hover:text-white tracking-wider uppercase transition-all duration-300 cursor-pointer text-[10px]"
                            >
                              Explore Manual Game Portal
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {tutorialStep === 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute top-20 left-6 max-w-xs sm:max-w-sm w-full bg-zinc-950/95 border border-[#C5A059]/40 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] pointer-events-auto text-left"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[8.5px] font-mono tracking-widest text-[#C5A059] uppercase font-black bg-[#C5A059]/10 px-2.5 py-1 rounded-full">
                              Step 1 of 3
                            </span>
                            <button
                              onClick={() => {
                                playChirp(330, 0.05);
                                setTutorialActive(false);
                                localStorage.setItem("capitalsCubeTutorialCompleted", "completed");
                              }}
                              className="text-[9.5px] font-mono hover:text-red-400 text-zinc-500 transition-all cursor-pointer"
                            >
                              SKIP
                            </button>
                          </div>
                          
                          <h5 className="text-white font-mono font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                            <span className="text-[#C5A059] animate-pulse">●</span>
                            Select any 3D Panel
                          </h5>

                          <p className="text-zinc-300 font-sans text text-[11px] leading-relaxed mt-2">
                            To modify the ESG matrix, first click on **any square sticker panel** on the 3D Rubik's Cube.
                          </p>

                          <div className="mt-4 p-2 bg-black/40 border border-[#C5A059]/10 rounded-lg flex items-center gap-2">
                            <div className="w-5 h-5 rounded bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-mono text-[9px] font-black shrink-0 animate-bounce">
                              ★
                            </div>
                            <span className="text-[10px] text-zinc-400 italic">Click one panel on the 3D cube right now to continue!</span>
                          </div>
                        </motion.div>
                      )}

                      {tutorialStep === 3 && (
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute top-20 left-6 max-w-xs sm:max-w-sm w-full bg-zinc-950/95 border border-[#C5A059]/40 backdrop-blur-md rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] pointer-events-auto text-left"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[8.5px] font-mono tracking-widest text-emerald-400 uppercase font-black bg-emerald-500/10 px-2.5 py-1 rounded-full">
                              Step 2 of 3
                            </span>
                            <button
                              onClick={() => {
                                playChirp(330, 0.05);
                                setTutorialActive(false);
                                localStorage.setItem("capitalsCubeTutorialCompleted", "completed");
                              }}
                              className="text-[9.5px] font-mono hover:text-red-400 text-zinc-500 transition-all cursor-pointer"
                            >
                              SKIP
                            </button>
                          </div>
                          
                          <h5 className="text-white font-mono font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                            <span className="text-emerald-400 animate-ping">●</span>
                            Rotate the Active Layer
                          </h5>

                          <p className="text-zinc-300 font-sans text text-[11px] leading-relaxed mt-2">
                            Amazing! With a panel active, you have access to the alignment row controls.
                          </p>
                          
                          <ul className="space-y-1.5 font-sans text-[10.5px] text-zinc-400 mt-3 pl-3.5 list-disc">
                            <li><strong>Press Arrow Keys (▲, ▼, ◀, ▶)</strong> on your physical keyboard, OR</li>
                            <li><strong>Click on-screen arrow buttons</strong> in the bottom compass overlay!</li>
                          </ul>

                          <div className="mt-4 p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-[10px] text-emerald-400 font-medium animate-pulse">
                            Action: Press an Arrow Key or click compass buttons to rotate now!
                          </div>
                        </motion.div>
                      )}

                      {tutorialStep === 4 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-zinc-950/98 border border-[#C5A059] rounded-3xl p-6 max-w-sm sm:max-w-md w-full shadow-[0_22px_50px_rgba(0,0,0,0.9)] pointer-events-auto text-center"
                        >
                          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-4">
                            <CheckCircle className="w-6 h-6 animate-bounce" />
                          </div>
                          
                          <span className="text-[8.5px] font-mono tracking-widest text-[#C5A059] uppercase block font-black">
                            Step 3 of 3 Completed
                          </span>
                          <h4 className="text-lg font-serif text-white italic font-bold tracking-tight mt-1">
                            Ready for Alignment!
                          </h4>

                          <p className="text-zinc-300 font-sans text-[11px] leading-relaxed mt-3">
                            Superb rotation! The corporate capitals have begun synchronization.
                            To inspect different ESG faces, deselect by clicking outside (or ESC), then **drag with your mouse to orbit the 3D canvas**!
                          </p>

                          <button
                            onClick={() => {
                              playChirp(880, 0.25);
                              setTutorialActive(false);
                              localStorage.setItem("capitalsCubeTutorialCompleted", "completed");
                            }}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-mono text-xs font-bold tracking-wider uppercase transition-all duration-300 mt-6 active:scale-95 shadow-[0_4px_15px_rgba(16,185,129,0.3)] cursor-pointer"
                          >
                            Begin Exploration ➔
                          </button>
                        </motion.div>
                      )}
                    </div>

                  </div>
                )}
              </AnimatePresence>

              {/* FLOATING ESG AI SUPPORT STEP SOLVER OVERLAY */}
              <AnimatePresence>
                {isAiSupportActive && !solved && solvedStack.length > 0 && !aiIntroModal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -15 }}
                    className="absolute top-4 sm:top-6 inset-x-4 flex justify-center z-25 pointer-events-none animate-fadeIn"
                  >
                    <div className="bg-[#020d07]/98 border border-[#C5A059]/40 rounded-full px-5 py-2.5 max-w-sm sm:max-w-md w-fit shadow-[0_8px_30px_rgba(197,160,89,0.3)] pointer-events-auto flex items-center gap-3.5 backdrop-blur-md">
                      <div className="w-6 h-6 rounded-full bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse" />
                      </div>
                      
                      {(() => {
                        const step = getNextSolveStep();
                        if (!step) return null;

                        return (
                          <div className="flex items-center gap-3 sm:gap-4">
                            <span className="bg-[#C5A059]/20 border border-[#C5A059]/40 px-3 py-1 rounded-lg text-white font-mono font-bold text-[10.5px] uppercase animate-pulse shrink-0 tracking-wide">
                              {step.direction === "left" && "◀ ROTATE LEFT"}
                              {step.direction === "right" && "▶ ROTATE RIGHT"}
                              {step.direction === "up" && "▲ ROTATE UP"}
                              {step.direction === "down" && "▼ ROTATE DOWN"}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-mono tracking-wide shrink-0">
                              Arrow Key or Click Compass
                            </span>
                          </div>
                        );
                      })()}
                      
                      <div className="w-px h-4 bg-white/10" />
                      <button
                        onClick={() => {
                          playChirp(330, 0.05);
                          setIsAiSupportActive(false);
                        }}
                        className="text-[9px] font-mono hover:text-red-400 text-zinc-500 transition-all cursor-pointer font-bold uppercase shrink-0"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CENTRAL AI INTRO TYPEWRITER AND PROGRESS OVERLAY */}
              <AnimatePresence>
                {aiIntroModal && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 z-40 pointer-events-none">
                    {/* Dim backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.82 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/85 backdrop-blur-sm pointer-events-auto"
                      onClick={() => setAiIntroModal(false)}
                    />

                    {/* Main Futuristic AI Popup Panel */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="bg-gradient-to-b from-[#0b1624] via-[#02050a]/98 to-[#010204] border-2 border-indigo-500 rounded-[32px] p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-[0_25px_60px_rgba(99,102,241,0.4)] pointer-events-auto text-center relative overflow-hidden"
                    >
                      {/* Top Glowing Strip */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-505 bg-indigo-500 animate-pulse" />

                      {/* Header Logo */}
                      <div className="mx-auto w-14 h-14 bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
                        <Sparkles className="w-7 h-7" />
                      </div>

                      <span className="text-[9.5px] font-mono tracking-[0.2em] text-indigo-400 uppercase block font-bold bg-indigo-500/10 rounded-full px-3 py-1 w-fit mx-auto mb-3 animate-pulse">
                        🤖 AI ALIGNMENT ENGINE ACTIVE
                      </span>

                      <h4 className="text-xl font-serif text-white italic font-bold tracking-tight">
                        HPG Governance AI Support
                      </h4>

                      {/* Typewriter text message as requested by user */}
                      <div className="text-zinc-300 font-mono text-[10.5px] leading-relaxed mt-4 h-[120px] overflow-y-auto px-1 text-left bg-black/40 border border-indigo-500/15 rounded-xl p-3.5">
                        <TypewriterText 
                          text="SYSTEM SYNCHRONIZED. The optimal strategic 3D panels have been automatically selected for you in blue highlighting. Simply rotate the row layer using your Keyboard Arrow Keys or clicking the Compass Control deck as guided. Realign Horana with AI assistance!" 
                          speed={15} 
                        />
                      </div>

                      {/* Timer Countdown representation for approx 4 seconds */}
                      <div className="mt-5">
                        <div className="w-full bg-indigo-950/40 rounded-full h-1 border border-indigo-500/10 overflow-hidden">
                          <motion.div 
                            className="bg-indigo-500 h-full" 
                            style={{ width: `${introTimerProgress}%` }}
                          />
                        </div>
                        <div className="mt-1.5 flex justify-between items-center text-[8px] font-mono text-zinc-500 tracking-wider">
                          <span>SYNAPSE ENGINE STABILIZING</span>
                          <span>{Math.max(1, Math.round(introTimerProgress * 4.5 / 100))}S REMAINING</span>
                        </div>
                      </div>

                      {/* Button to let user close or bypass wait immediately */}
                      <div className="mt-6 flex gap-2">
                        <button
                          onClick={() => {
                            playChirp(330, 0.05);
                            setAiIntroModal(false);
                          }}
                          className="w-full py-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/30 border border-indigo-500/30 hover:border-indigo-500 text-indigo-300 font-mono text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                        >
                          Skip Sync & Play
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>

            {/* Sleek Floating Bottom Control Deck for Mobile when no sticker is selected */}
            {!selectedSticker && (
              <div className="lg:hidden absolute bottom-6 inset-x-4 z-20 pointer-events-none flex justify-center">
                <div className="pointer-events-auto flex items-center gap-2 bg-zinc-950/90 border border-white/10 rounded-2xl p-2 shadow-[0_15px_30px_rgba(0,0,0,0.6)] backdrop-blur-md">
                  
                  {/* Scramble */}
                  <button
                    onClick={handleScramble}
                    disabled={scrambling || !!activeTurn}
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-[#C5A059] text-black text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all active:scale-95 disabled:opacity-40"
                  >
                    <Shuffle className={`w-3.5 h-3.5 ${scrambling ? "animate-spin" : ""}`} />
                    <span>Scramble</span>
                  </button>

                  <div className="w-px h-6 bg-white/10" />

                  {/* Reset */}
                  <button
                    onClick={resetPuzzle}
                    disabled={scrambling || !!activeTurn}
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all active:scale-95 disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  {/* AI Support Mobile Integration */}
                  {solvedStack.length > 0 && !solved && (
                    <>
                      <div className="w-px h-6 bg-white/10" />
                      <button
                        onClick={() => {
                          const nextVal = !isAiSupportActive;
                          setIsAiSupportActive(nextVal);
                          if (nextVal) {
                            setAiIntroModal(true);
                          }
                          playChirp(680, 0.15);
                        }}
                        className={`flex items-center gap-1.5 py-2 px-3 rounded-xl border text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all active:scale-95 ${
                          isAiSupportActive
                            ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-pulse"
                            : "bg-indigo-950/20 border-indigo-500/30 text-indigo-300"
                        }`}
                        title="Toggle AI Support Solve Guide"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isAiSupportActive ? "animate-pulse" : ""}`} />
                        <span>AI Assist</span>
                      </button>
                    </>
                  )}

                  <div className="w-px h-6 bg-white/10" />

                  {/* Manual playbook button */}
                  <button
                    onClick={() => setShowHelp(!showHelp)}
                    className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-[10.5px] font-mono font-bold tracking-wider uppercase transition-all active:scale-95"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Guide</span>
                  </button>

                </div>
              </div>
            )}

            {/* Drawers / Mobile Options Drawer Sheet */}
            <AnimatePresence>
              {mobileOptionsOpen && (
                <>
                  {/* Dark Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setMobileOptionsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black z-40"
                  />
                  
                  {/* Slide-Up Drawer */}
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 220 }}
                    className="lg:hidden fixed inset-x-0 bottom-0 bg-[#020d07]/95 border-t border-[#C5A059]/40 rounded-t-3xl p-5 z-55 shadow-[0_-15px_40px_rgba(0,0,0,0.85)] max-h-[85vh] overflow-y-auto font-sans flex flex-col gap-4 pb-8"
                  >
                    {/* Header bar drag handle placeholder */}
                    <div className="w-12 h-1 bg-white/10 rounded-full mx-auto cursor-pointer" onClick={() => setMobileOptionsOpen(false)} />
                    
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#C5A059]" />
                        <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase">System Options</h4>
                      </div>
                      <button
                        onClick={() => setMobileOptionsOpen(false)}
                        className="p-1 px-2.5 rounded-lg bg-white/10 text-zinc-300 hover:text-white text-[9.5px] font-mono transition-all"
                      >
                        CLOSE
                      </button>
                    </div>

                    {/* Tabs Segment */}
                    <div className="flex gap-1 bg-black/50 p-1 rounded-xl border border-white/5 font-display overflow-x-auto">
                      {[
                        { id: "portfolio", label: "PORTFOLIO" },
                        { id: "financials", label: "FINANCE" },
                        { id: "options", label: "OPTIONS" },
                        { id: "rules", label: "RULES" },
                        { id: "legend", label: "LEGEND" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveSidebarTab(tab.id as any);
                            playChirp(700, 0.05);
                          }}
                          className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer ${
                            activeSidebarTab === tab.id
                              ? "bg-[#C5A059] text-black shadow-md font-black"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Tab View Container */}
                    <div className="flex-grow overflow-y-auto max-h-[45vh] pr-1 py-1">
                      {activeSidebarTab === "portfolio" && (
                        <div className="animate-fadeIn">
                          <CubeCorporateShowcase />
                        </div>
                      )}

                      {activeSidebarTab === "financials" && (
                        <div className="animate-fadeIn">
                          <TenYearSummaryDashboard variant="compact" defaultCategory="operating" defaultMetricId="revenue" />
                        </div>
                      )}

                      {activeSidebarTab === "options" && (
                        <div className="flex flex-col gap-4 text-xs animate-fadeIn">
                          {/* Play mode */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-[#C5A059] tracking-wider uppercase">Strategy Game Mode:</span>
                            <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1.5 rounded-lg border border-white/5">
                              <button
                                onClick={() => { setGameMode("free"); playChirp(500, 0.05); }}
                                className={`py-1.5 rounded text-[10px] font-mono font-bold tracking-wider transition-all ${
                                  gameMode === "free"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                                }`}
                              >
                                Endless Free
                              </button>
                              <button
                                onClick={() => { setGameMode("challenge"); playChirp(600, 0.05); }}
                                className={`py-1.5 rounded text-[10px] font-mono font-bold tracking-wider transition-all ${
                                  gameMode === "challenge"
                                    ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30"
                                    : "text-zinc-500 hover:text-zinc-300 border border-transparent"
                                }`}
                              >
                                40 Turns Limit
                              </button>
                            </div>
                          </div>

                          {/* Difficulty */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-[#C5A059] tracking-wider uppercase">Scramble Complexity:</span>
                            <div className="grid grid-cols-3 gap-1 bg-black/40 p-1.5 rounded-lg border border-white/5">
                              {[
                                { id: "easy", label: "EASY (5)" },
                                { id: "medium", label: "MED (12)" },
                                { id: "hard", label: "HARD (25)" }
                              ].map((d) => (
                                <button
                                  key={d.id}
                                  onClick={() => { setScrambleDifficulty(d.id as any); playChirp(520, 0.05); }}
                                  className={`py-1.5 rounded text-[9.5px] font-mono font-bold tracking-wide transition-all ${
                                    scrambleDifficulty === d.id
                                      ? "bg-[#C5A059] text-black"
                                      : "text-zinc-500 hover:text-zinc-300"
                                  }`}
                                >
                                  {d.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Countdown Limit */}
                          <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5 font-mono">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11px] font-sans font-bold text-zinc-300">Countdown Limit</span>
                              <span className="text-[9.5px] font-sans text-zinc-500">3 Min Expiry Law</span>
                            </div>
                            <button
                              onClick={() => { setCountdownMode(!countdownMode); playChirp(580, 0.05); }}
                              className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
                                countdownMode ? "bg-[#C5A059] justify-end" : "bg-zinc-800 justify-start"
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full shadow-md transition-all ${
                                countdownMode ? "bg-black" : "bg-zinc-400"
                              }`} />
                            </button>
                          </div>
                        </div>
                      )}

                      {activeSidebarTab === "rules" && (
                        <div className="flex flex-col gap-2 text-xs text-zinc-300 leading-relaxed">
                          <div className="flex gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-black">01.</span>
                            <p><strong>Corporate Equilibrium:</strong> Each side must have exactly 9 matching strategic panels of its capital color group.</p>
                          </div>
                          <div className="flex gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-black">02.</span>
                            <p><strong>Infinite Rotations:</strong> In Free Strategy options, you can rotate any face as much as you want endlessly without constraints.</p>
                          </div>
                          <div className="flex gap-2 bg-black/25 p-2 rounded-lg border border-white/5">
                            <span className="font-mono text-[#C5A059] font-black">03.</span>
                            <p><strong>Efficiency Rating:</strong> Enter Challenge mode to maintain the corporate balance sheet within a strict 40-turns threshold.</p>
                          </div>
                        </div>
                      )}

                      {activeSidebarTab === "legend" && (
                        <div className="flex flex-col gap-2 text-xs">
                          {Object.entries(BRAND_COLORS).map(([key, item]) => {
                            const Icon = item.icon;
                            return (
                              <div key={key} className="flex items-center justify-between bg-black/25 p-1.5 rounded-lg border border-white/5 gap-2 font-display">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="w-2.5 h-2.5 rounded shrink-0 shadow-sm" style={{ backgroundColor: item.hex }} />
                                  <span className="font-mono font-bold text-white uppercase tracking-wider shrink-0">[{item.label}]</span>
                                  <span className="truncate text-zinc-400 text-[10px]">{item.name}</span>
                                </div>
                                <Icon className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>

          {/* Right Sidebar: Permanent Desktop-Only Showcase Panel */}
          <div className="hidden xl:flex w-[340px] shrink-0 border-l border-[#C5A059]/20 p-8 flex-col justify-between bg-gradient-to-b from-[#020d07] via-[#010402] to-[#020d07] z-10 relative overflow-y-auto scrollbar-none animate-fadeIn">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#C5A059]" />
            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A059] uppercase block font-black mb-1.5 animate-pulse text-left">
                  BOARDROOM STREAM
                </span>
                <h3 className="text-xl font-serif text-white leading-tight font-bold text-left">
                  Consolidated <span className="text-[#C5A059] italic font-normal">Capitals Channel</span>
                </h3>
                <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-2 font-sans text-left">
                  Real-time corporate performance, financial reports, carbon levels, and social parameters are streamed live in the strategy portal.
                </p>
              </div>
              
              <CubeCorporateShowcase />

              <div className="pt-4 border-t border-white/5">
                <span className="text-[8.5px] font-mono text-[#C5A059] uppercase tracking-widest block font-bold leading-none text-left mb-3">
                  Ten Year Financial Story
                </span>
                <TenYearSummaryDashboard variant="compact" defaultCategory="key-indicators" defaultMetricId="roe" />
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 space-y-2">
              <span className="text-[8.5px] font-mono text-[#C5A059] uppercase tracking-widest block font-bold leading-none text-left">
                Interactive Strategy Index
              </span>
              <p className="text-[9.5px] text-zinc-500 leading-relaxed font-sans text-left">
                Click any asset highlight card above to simulate operating gains and forecast key environmental metrics.
              </p>
            </div>
          </div>

        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
