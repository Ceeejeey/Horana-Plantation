import { useEffect, useRef, useState } from "react";
import { readLiveCarouselPosition } from "../features/capitals/carouselScrollSync";

const POSITION_EPSILON = 0.0005;

/**
 * RAF-driven carousel position (0–5) read directly from series-marker DOM.
 * Stays 1:1 with scroll — not delayed by React context batching.
 */
export function useLiveCarouselPosition(fallbackPosition: number): number {
  const [position, setPosition] = useState(fallbackPosition);
  const latest = useRef(fallbackPosition);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      const live = readLiveCarouselPosition();
      const next = live ?? latest.current;

      if (Math.abs(next - latest.current) > POSITION_EPSILON) {
        latest.current = next;
        setPosition(next);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (Math.abs(fallbackPosition - latest.current) > POSITION_EPSILON) {
      latest.current = fallbackPosition;
      setPosition(fallbackPosition);
    }
  }, [fallbackPosition]);

  return position;
}
