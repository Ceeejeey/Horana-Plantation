import { useEffect } from "react";
import { useActiveSection } from "../context/ActiveSectionContext";
import { REPORT_SECTION_IDS } from "../features/annual-report/reportNavigation";

export function useReportSectionSpy(active: boolean = true) {
  const { setActiveReportChapter } = useActiveSection();

  useEffect(() => {
    if (!active) return;

    const elements = REPORT_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length === 0) return;

        const id = visible[0].target.id;
        const index = REPORT_SECTION_IDS.indexOf(id);
        if (index >= 0) {
          setActiveReportChapter(index);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [active, setActiveReportChapter]);
}
