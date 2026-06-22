import { CapitalData, SDG } from "../../types";

export const SDG_METADATA: Record<number, Omit<SDG, "number">> = {
  1: {
    name: "No Poverty",
    color: "#E5243B",
    icon: "Coins",
  },
  2: {
    name: "Zero Hunger",
    color: "#DDA63A",
    icon: "Utensils",
  },
  3: {
    name: "Good Health & Well-being",
    color: "#4C9F38",
    icon: "HeartPulse",
  },
  4: {
    name: "Quality Education",
    color: "#C5192D",
    icon: "GraduationCap",
  },
  5: {
    name: "Gender Equality",
    color: "#FF3A21",
    icon: "Scale",
  },
  6: {
    name: "Clean Water & Sanitation",
    color: "#26BDE2",
    icon: "Droplets",
  },
  7: {
    name: "Affordable & Clean Energy",
    color: "#FCC30B",
    icon: "Zap",
  },
  8: {
    name: "Decent Work & Economic Growth",
    color: "#A21942",
    icon: "TrendingUp",
  },
  9: {
    name: "Industry, Innovation & Infrastructure",
    color: "#FD6925",
    icon: "Cpu",
  },
  10: {
    name: "Reduced Inequalities",
    color: "#DD1367",
    icon: "Users2",
  },
  12: {
    name: "Responsible Consumption & Production",
    color: "#BF8B2E",
    icon: "Infinity",
  },
  13: {
    name: "Climate Action",
    color: "#3F7E44",
    icon: "Globe2",
  },
  14: {
    name: "Life Below Water",
    color: "#0A97D9",
    icon: "Waves",
  },
  15: {
    name: "Life on Land",
    color: "#56C02B",
    icon: "Trees",
  },
  17: {
    name: "Partnerships for the Goals",
    color: "#19486A",
    icon: "Handshake",
  },
};

export const getSDG = (num: number): SDG => {
  const meta = SDG_METADATA[num];
  return {
    number: num,
    name: meta?.name || "Sustainable Development Goal",
    color: meta?.color || "#565656",
    icon: meta?.icon || "Check",
  };
};

export const CAPITALS_DATA: CapitalData[] = [
  {
    id: "financial",
    index: 1,
    title: "Creating Momentum",
    concept: "Each adjustment in the system creates value.",
    body: [
      "Through diversification, market expansion, and value-added products, we are strengthening our financial resilience and unlocking new opportunities for growth.",
      "This dimension ensures that our model remains sustainable, competitive, and adaptable in a changing global market.",
    ],
    sdgs: [getSDG(1), getSDG(8)],
    themeColor: "from-emerald-950 via-emerald-900 to-slate-950",
    accentColor: "text-amber-400 border-amber-400/30 bg-amber-500/10",
    cubeFaceIndex: 0,
  },
  {
    id: "manufactured",
    index: 2,
    title: "Building the System",
    concept: "Structure is what holds complexity together.",
    body: [
      "Our estates, factories, and infrastructure form the operational backbone of Horana Plantations. Through modernization, efficiency improvements, and sustainable energy integration, we ensure that our systems remain strong, reliable, and future-ready.",
      "This is the face that keeps the entire cube functioning in harmony.",
    ],
    sdgs: [getSDG(2), getSDG(6), getSDG(7), getSDG(9), getSDG(12)],
    themeColor: "from-stone-950 via-teal-950 to-emerald-950",
    accentColor: "text-teal-400 border-teal-400/30 bg-teal-500/10",
    cubeFaceIndex: 1,
  },
  {
    id: "intellectual",
    index: 3,
    title: "Solving with Intelligence",
    concept: "Complexity requires intelligence.",
    body: [
      "Through digital transformation, research, and innovation, we are improving the precision and efficiency of every aspect of our operations.",
      "Data, technology, and knowledge allow us to continuously refine our system—ensuring better decisions and stronger outcomes.",
    ],
    sdgs: [getSDG(2), getSDG(4), getSDG(8), getSDG(9), getSDG(12), getSDG(17)],
    themeColor: "from-cyan-950 via-slate-900 to-emerald-950",
    accentColor: "text-cyan-400 border-cyan-400/30 bg-cyan-500/10",
    cubeFaceIndex: 2,
  },
  {
    id: "human",
    index: 4,
    title: "Every Turn is People-Led",
    concept: "No system can be solved without people.",
    body: [
      "Our employees are the force that moves every dimension of our business.",
      "From estate workers to families and local communities, we are committed to empowering the people who make alignment possible.",
      "Through education, wellbeing, and inclusive growth, we ensure that every rotation of progress benefits those who drive it.",
    ],
    sdgs: [getSDG(1), getSDG(3), getSDG(4), getSDG(5), getSDG(8)],
    themeColor: "from-blue-950 via-indigo-950 to-emerald-950",
    accentColor: "text-indigo-400 border-indigo-400/30 bg-indigo-500/10",
    cubeFaceIndex: 3,
  },
  {
    id: "social",
    index: 5,
    title: "Every Connection Creates Alignment",
    concept: "No system can be solved without strong relationships.",
    body: [
      "Our communities, customers, suppliers, and stakeholders are the connections that bring every dimension of our business together. Like a Rubik's Cube, every partnership and interaction plays a role in creating balance and long-term progress.",
      "Through trust, collaboration, and shared value, we strengthen the relationships that keep every turn of progress aligned and meaningful.",
    ],
    sdgs: [getSDG(2), getSDG(5), getSDG(8), getSDG(10)],
    themeColor: "from-slate-950 via-indigo-950 to-teal-950",
    accentColor: "text-sky-400 border-sky-400/30 bg-sky-500/10",
    cubeFaceIndex: 4,
  },
  {
    id: "natural",
    index: 6,
    title: "Where Alignment Begins",
    concept: "Every solution begins with a foundation.",
    body: [
      "The natural environment is the base layer of our entire system—providing the soil, water, biodiversity, and climate conditions that make plantation life possible.",
      "Through conservation, regenerative practices, and sustainable land management, we ensure this critical dimension remains stable and resilient.",
    ],
    sdgs: [getSDG(7), getSDG(12), getSDG(13), getSDG(14), getSDG(15)],
    themeColor: "from-emerald-950 via-teal-950 to-slate-950",
    accentColor: "text-emerald-400 border-emerald-400/30 bg-emerald-500/10",
    cubeFaceIndex: 5,
  },
];
