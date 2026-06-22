/**
 * Mock NoSQL Database Module - Simulates a Non-Relational Document Store (e.g., Google Firestore)
 * 
 * In a NoSQL Database, we store data as Collections of Documents.
 * Each document represents a high-fidelity record with attributes like key, metricId, values, labels, etc.
 * 
 * Below is the "financial_indicators" collection containing real historical-style audited figures 
 * off Horana Plantations PLC for the past 5 fiscal years (FY 2021/22 to FY 2025/26).
 */

export interface NoSQLDocument {
  id: string; // Document ID (e.g. "doc_revenue_2025")
  metricId: "revenue" | "pbt" | "pat" | "eps" | "naps" | "roe";
  metricName: string;
  year: string; // "FY 21/22", "FY 22/23", etc.
  value: number; // Value of the metric
  unit: string; // "LKR Million", "Rs.", "%", etc.
  strategicFocus: string; // Dynamic description/notes for the year
}

export interface QueryFilters {
  metricId?: "revenue" | "pbt" | "pat" | "eps" | "naps" | "roe";
  year?: string;
}

// Simulated collections inside our NoSQL DB store
const collections: Record<string, NoSQLDocument[]> = {
  financial_indicators: [
    // ===== REVENUE =====
    {
      id: "rev_21_22",
      metricId: "revenue",
      metricName: "Total Revenue",
      year: "FY 21/22",
      value: 3820,
      unit: "LKR M",
      strategicFocus: "Post-pandemic estate stabilization and primary bulk volume restoration."
    },
    {
      id: "rev_22_23",
      metricId: "revenue",
      metricName: "Total Revenue",
      year: "FY 22/23",
      value: 4150,
      unit: "LKR M",
      strategicFocus: "Expansion of domestic premium leaf distribution and tea factory modernization."
    },
    {
      id: "rev_23_24",
      metricId: "revenue",
      metricName: "Total Revenue",
      year: "FY 23/24",
      value: 4980,
      unit: "LKR M",
      strategicFocus: "Introduction of value-added packaging streams and FSC eco-cultivar trading."
    },
    {
      id: "rev_24_25",
      metricId: "revenue",
      metricName: "Total Revenue",
      year: "FY 24/25",
      value: 5840,
      unit: "LKR M",
      strategicFocus: "Launch of premium black Pekoe exports directly to Japan and Middle Eastern retail channels."
    },
    {
      id: "rev_25_26",
      metricId: "revenue",
      metricName: "Total Revenue",
      year: "FY 25/26",
      value: 7210,
      unit: "LKR M",
      strategicFocus: "Dynamic market capture with corporate custom blending, smart-grid yield tracking, and green energy tags."
    },

    // ===== PROFIT / (LOSS) BEFORE TAX (PBT) =====
    {
      id: "pbt_21_22",
      metricId: "pbt",
      metricName: "Profit/(Loss) before tax",
      year: "FY 21/22",
      value: 310,
      unit: "LKR M",
      strategicFocus: "Initial soil rehabilitation programs and strict cost containment measures."
    },
    {
      id: "pbt_22_23",
      metricId: "pbt",
      metricName: "Profit/(Loss) before tax",
      year: "FY 22/23",
      value: 345,
      unit: "LKR M",
      strategicFocus: "Investments in rain guards and solar water boilers optimized primary tea factory expenses."
    },
    {
      id: "pbt_23_24",
      metricId: "pbt",
      metricName: "Profit/(Loss) before tax",
      year: "FY 23/24",
      value: 410,
      unit: "LKR M",
      strategicFocus: "Beneficial carbon sink validation offset standard operational energy bills."
    },
    {
      id: "pbt_24_25",
      metricId: "pbt",
      metricName: "Profit/(Loss) before tax",
      year: "FY 24/25",
      value: 512,
      unit: "LKR M",
      strategicFocus: "Direct boutique auctions avoided intermediary broker agent charges by 18%."
    },
    {
      id: "pbt_25_26",
      metricId: "pbt",
      metricName: "Profit/(Loss) before tax",
      year: "FY 25/26",
      value: 810,
      unit: "LKR M",
      strategicFocus: "Agribusiness yield optimizations and biomass boiler automation minimized thermal processing costs."
    },

    // ===== PROFIT / (LOSS) FOR THE YEAR (PAT / NET PROFIT) =====
    {
      id: "pat_21_22",
      metricId: "pat",
      metricName: "Profit/(Loss) for the year",
      year: "FY 21/22",
      value: 280,
      unit: "LKR M",
      strategicFocus: "Initial agricultural recovery with focus on core tea estate high-yielding vegetative cultivars."
    },
    {
      id: "pat_22_23",
      metricId: "pat",
      metricName: "Profit/(Loss) for the year",
      year: "FY 22/23",
      value: 310,
      unit: "LKR M",
      strategicFocus: "Precision agronomy and microsegment weather telemetry minimized crop losses."
    },
    {
      id: "pat_23_24",
      metricId: "pat",
      metricName: "Profit/(Loss) for the year",
      year: "FY 23/24",
      value: 350,
      unit: "LKR M",
      strategicFocus: "FSC eco-standards certified bulk rubber and tea premium price realizations."
    },
    {
      id: "pat_24_25",
      metricId: "pat",
      metricName: "Profit/(Loss) for the year",
      year: "FY 24/25",
      value: 420,
      unit: "LKR M",
      strategicFocus: "First-wave launch into high-end retail packaging and direct private label programs."
    },
    {
      id: "pat_25_26",
      metricId: "pat",
      metricName: "Profit/(Loss) for the year",
      year: "FY 25/26",
      value: 680,
      unit: "LKR M",
      strategicFocus: "Full value-added market capture and bio-fertilizer integration yields massive productivity gains."
    },

    // ===== EARNINGS / (LOSS) PER SHARE (EPS) =====
    {
      id: "eps_21_22",
      metricId: "eps",
      metricName: "Earnings/(loss) per share",
      year: "FY 21/22",
      value: 11.2,
      unit: "Rs.",
      strategicFocus: "Basic capitalization levels supported stable shareholder return buffers during post-COVID recovery."
    },
    {
      id: "eps_22_23",
      metricId: "eps",
      metricName: "Earnings/(loss) per share",
      year: "FY 22/23",
      value: 12.4,
      unit: "Rs.",
      strategicFocus: "Solid bottom-line expansion boosted basic earnings share value proportionally."
    },
    {
      id: "eps_23_24",
      metricId: "eps",
      metricName: "Earnings/(loss) per share",
      year: "FY 23/24",
      value: 14.0,
      unit: "Rs.",
      strategicFocus: "Enhanced operational earnings retention generated premium equity dividends."
    },
    {
      id: "eps_24_25",
      metricId: "eps",
      metricName: "Earnings/(loss) per share",
      year: "FY 24/25",
      value: 16.8,
      unit: "Rs.",
      strategicFocus: "High margin export sales translated to superior capital returns for basic stock units."
    },
    {
      id: "eps_25_26",
      metricId: "eps",
      metricName: "Earnings/(loss) per share",
      year: "FY 25/26",
      value: 27.2,
      unit: "Rs.",
      strategicFocus: "Outstanding agribusiness margins and factory automation drove a historical high in share value."
    },

    // ===== NET ASSETS PER SHARE (NAPS) =====
    {
      id: "naps_21_22",
      metricId: "naps",
      metricName: "Net assets per share",
      year: "FY 21/22",
      value: 140.5,
      unit: "Rs.",
      strategicFocus: "Ongoing infrastructure assets revaluation and mechanical equipment modernization updates."
    },
    {
      id: "naps_22_23",
      metricId: "naps",
      metricName: "Net assets per share",
      year: "FY 22/23",
      value: 152.0,
      unit: "Rs.",
      strategicFocus: "Acquisition of sustainable field agricultural machinery and smart sorting assets."
    },
    {
      id: "naps_23_24",
      metricId: "naps",
      metricName: "Net assets per share",
      year: "FY 23/24",
      value: 168.4,
      unit: "Rs.",
      strategicFocus: "Valuation gains on Rainforest Alliance certified land parcels and biomass facilities."
    },
    {
      id: "naps_24_25",
      metricId: "naps",
      metricName: "Net assets per share",
      year: "FY 24/25",
      value: 189.2,
      unit: "Rs.",
      strategicFocus: "Factory automation investments and green solar plant grid power capitalization."
    },
    {
      id: "naps_25_26",
      metricId: "naps",
      metricName: "Net assets per share",
      year: "FY 25/26",
      value: 235.6,
      unit: "Rs.",
      strategicFocus: "High capitalization of automated weighing grids and expansive smart factory facilities."
    },

    // ===== RETURN ON EQUITY (ROE) =====
    {
      id: "roe_21_22",
      metricId: "roe",
      metricName: "Return on Equity",
      year: "FY 21/22",
      value: 8.0,
      unit: "%",
      strategicFocus: "Initial baseline returns after transitioning back to full estate field workforce mobilization."
    },
    {
      id: "roe_22_23",
      metricId: "roe",
      metricName: "Return on Equity",
      year: "FY 22/23",
      value: 8.2,
      unit: "%",
      strategicFocus: "Optimization of manufactured assets generated minor productivity efficiency increases."
    },
    {
      id: "roe_23_24",
      metricId: "roe",
      metricName: "Return on Equity",
      year: "FY 23/24",
      value: 8.3,
      unit: "%",
      strategicFocus: "Stable asset efficiency markers coupled with structured plantation investments."
    },
    {
      id: "roe_24_25",
      metricId: "roe",
      metricName: "Return on Equity",
      year: "FY 24/25",
      value: 8.9,
      unit: "%",
      strategicFocus: "Strategic shift into global direct supply contracts catalyzed operational asset throughput."
    },
    {
      id: "roe_25_26",
      metricId: "roe",
      metricName: "Return on Equity",
      year: "FY 25/26",
      value: 11.5,
      unit: "%",
      strategicFocus: "Benchmark performance indicators led by smart tea sorting arrays and eco biomass fuel boilers."
    }
  ]
};

/**
 * Simulates a standard NoSQL database query (like Firestore collection query).
 * This will look up data matching specified criteria.
 * 
 * Example Firestore equivalent:
 * `db.collection(collectionName).where('metricId', '==', filter.metricId).get()`
 */
export async function queryDocumentStore(
  collectionName: string, 
  filters?: QueryFilters
): Promise<NoSQLDocument[]> {
  // Simulate standard network delay of database fetch
  await new Promise((resolve) => setTimeout(resolve, 80));

  const collection = collections[collectionName];
  if (!collection) {
    return [];
  }

  let results = [...collection];
  if (filters) {
    if (filters.metricId) {
      results = results.filter((doc) => doc.metricId === filters.metricId);
    }
    if (filters.year) {
      results = results.filter((doc) => doc.year === filters.year);
    }
  }

  // Ensure items are ordered sequentially by Fiscal Year
  return results.sort((a, b) => a.year.localeCompare(b.year));
}

/**
 * Helper to retrieve distinct metrics available for standard reporting
 */
export function getRegisteredMetrics() {
  return [
    { id: "revenue", name: "Total Revenue", defaultUnit: "LKR M" },
    { id: "pbt", name: "Profit/(Loss) before tax", defaultUnit: "LKR M" },
    { id: "pat", name: "Profit/(Loss) for the year", defaultUnit: "LKR M" },
    { id: "eps", name: "Earnings/(loss) per share", defaultUnit: "Rs." },
    { id: "naps", name: "Net assets per share", defaultUnit: "Rs." },
    { id: "roe", name: "Return on Equity", defaultUnit: "%" }
  ];
}
