import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

interface ActiveSectionContextType {
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
  activeReportChapter: number;
  setActiveReportChapter: (index: number) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  setActiveSection: (index: number, progress: number) => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextType | undefined>(undefined);

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ index: 1, progress: 0, reportChapter: 0 });

  const setActiveSection = useCallback((index: number, progress: number) => {
    setState((prev) => {
      // Prevent unnecessary state updates if values are close enough to previous values
      if (prev.index === index && Math.abs(prev.progress - progress) < 0.0001) {
        return prev;
      }
      return { ...prev, index, progress };
    });
  }, []);

  const setActiveSectionIndex = useCallback((index: number) => {
    setState((prev) => (prev.index === index ? prev : { ...prev, index }));
  }, []);

  const setScrollProgress = useCallback((progress: number) => {
    setState((prev) => {
      if (Math.abs(prev.progress - progress) < 0.0001) {
        return prev;
      }
      return { ...prev, progress };
    });
  }, []);

  const setActiveReportChapter = useCallback((index: number) => {
    setState((prev) => (prev.reportChapter === index ? prev : { ...prev, reportChapter: index }));
  }, []);

  const contextValue = useMemo(() => ({
    activeSectionIndex: state.index,
    setActiveSectionIndex,
    activeReportChapter: state.reportChapter,
    setActiveReportChapter,
    scrollProgress: state.progress,
    setScrollProgress,
    setActiveSection,
  }), [state.index, state.reportChapter, state.progress, setActiveSectionIndex, setActiveReportChapter, setScrollProgress, setActiveSection]);

  return (
    <ActiveSectionContext.Provider value={contextValue}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection() {
  const context = useContext(ActiveSectionContext);
  if (!context) {
    throw new Error("useActiveSection must be used within an ActiveSectionProvider");
  }
  return context;
}

