import { TopicCategory } from "../types/chat";

export const ANNUAL_REPORT_TOPICS: TopicCategory[] = [
  {
    category: "Financial Performance (NoSQL Documents)",
    iconType: "financial",
    items: [
      {
        title: "Total Revenue Trajectory",
        desc: "Query document store collections for corporate sales turnover indicators.",
        prompt: "Query revenue database and show me the Total Revenue comparison chart."
      },
      {
        title: "Profit Before Tax (PBT)",
        desc: "Examine earnings parameters before statutory taxation adjustments.",
        prompt: "Query the database for Profit before tax (PBT) and display the audited graph."
      },
      {
        title: "Profit for the Year (PAT)",
        desc: "Review net profit indexes representing retained corporate margins.",
        prompt: "Query the NoSQL database for Net Profit for the year and show the comparison graph."
      },
      {
        title: "Earnings Per Share (EPS)",
        desc: "Dividend generation margins calculated on standard stock allocations.",
        prompt: "Query the EPS indicators from our collections and draw the Earnings Per Share (Rs) chart."
      },
      {
        title: "Net Assets Per Share (NAPS)",
        desc: "Asset backing valuation demonstrating long-term sustainable equity properties.",
        prompt: "Run query for Net Assets per Share and build the comparative NAPS graph."
      },
      {
        title: "Return on Equity (ROE)",
        desc: "Yield ratios reflecting operational efficiency against shareholder equity.",
        prompt: "Show me the Return on Equity (%) comparison chart from our NoSQL indicators database."
      }
    ]
  },
  {
    category: "Natural Capital & Environment",
    iconType: "natural",
    items: [
      {
        title: "Rainforest Alliance Sourcing",
        desc: "Biodiversity preservation & estate compliance.",
        prompt: "How does Horana implement Rainforest Alliance and FSC certifications across its estates and manage soil health?"
      },
      {
        title: "Biomass Green Energy Transition",
        desc: "Replacing fossil fuels with eco wood boilers.",
        prompt: "Provide a detailed report on Horana's transition to green energy, including biomass boilers in tea factories and carbon emissions goals."
      },
      {
        title: "Micro-Watershed Conservation",
        desc: "Protecting streams & stream filters across tea valleys.",
        prompt: "Tell me about Horana's natural conservation program focusing on protecting 750 hectares of micro-watersheds and ecosystem buffer zones."
      }
    ]
  },
  {
    category: "Manufactured & Tech Assets",
    iconType: "tech",
    items: [
      {
        title: "Drone Analytics & Agronomy",
        desc: "Canopy scanning and crop health tracking system.",
        prompt: "What technologies are used in precision agriculture at Horana? Explain the drone canopy scanning and satellite crop mapping."
      },
      {
        title: "Smart RFID Weighing Grids",
        desc: "Leaf collection traceability with automatic credits.",
        prompt: "Detail how Horana's RFID-enabled leaf collection weighing scales optimize yield data transparency and field labor productivity records."
      },
      {
        title: "Continuous Factory Processing",
        desc: "Fermentation thermal sensors & tea dryers auto-regulation.",
        prompt: "Explain the automated controls, thermal monitoring, and continuous fermentation rooms introduced at the Fairlawn tea factory."
      }
    ]
  },
  {
    category: "Human & Community Capitals",
    iconType: "human",
    items: [
      {
        title: "Estate Housing & Community Welfare",
        desc: "New housing programs and clean drinking water pipeline.",
        prompt: "Explain Horana's housing development and piped clean water supply projects for estate worker families."
      },
      {
        title: "Fairtrade Premium Allocations",
        desc: "Scholarship grants & micro-finance funding.",
        prompt: "How are Fairtrade Premium funds allocated at Horana? Share details about scholar grants and tappers micro-credit facilities."
      },
      {
        title: "Health Care & Medical Camps",
        desc: "Routine wellness clinics and picker protective gear.",
        prompt: "Describe Horana's medical camps, health checkups, and standard field security equipment provided to rubber tappers and tea pluckers."
      }
    ]
  }
];

/**
 * Filter topics index based on target search keyword
 */
export function getFilteredTopics(searchTerm: string): TopicCategory[] {
  if (!searchTerm.trim()) return ANNUAL_REPORT_TOPICS;
  
  const keyword = searchTerm.toLowerCase();
  return ANNUAL_REPORT_TOPICS.map(category => {
    const matchedItems = category.items.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword) ||
      category.category.toLowerCase().includes(keyword)
    );
    return { ...category, items: matchedItems };
  }).filter(category => category.items.length > 0);
}

/**
 * Localized Query Router Mock client-side system (simulates semantic index targeting)
 */
export const samplePrompts = [
  { label: "Show Profit comparison chart", text: "Show me the Year-Over-Year Profit comparison graph." },
  { label: "Precision Agriculture", text: "Explain Horana's Intellect Capital and precision drone systems." },
  { label: "Environmental Carbon Sinks", text: "How is Horana committing to natural carbon sequestration?" }
];
