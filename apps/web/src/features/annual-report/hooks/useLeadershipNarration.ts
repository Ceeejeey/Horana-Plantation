import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface WordSpan {
  word: string;
  start: number;
}

function buildWordSpans(quote: string): WordSpan[] {
  const result: WordSpan[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(quote)) !== null) {
    result.push({ word: match[0], start: match.index });
  }
  return result;
}

function wordIndexAtChar(words: WordSpan[], charIndex: number): number {
  let idx = 0;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start <= charIndex) idx = i;
    else break;
  }
  return idx;
}

export function useLeadershipNarration(quote: string) {
  const words = useMemo(() => buildWordSpans(quote), [quote]);
  const [playing, setPlaying] = useState(false);
  const [activeWord, setActiveWord] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const wordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (wordTimerRef.current) {
      clearInterval(wordTimerRef.current);
      wordTimerRef.current = null;
    }
    setPlaying(false);
    setActiveWord(-1);
    utteranceRef.current = null;
  }, []);

  useEffect(() => () => stop(), [stop]);

  const startWordFallback = useCallback(
    (utterance: SpeechSynthesisUtterance) => {
      const wpm = 145 * (utterance.rate || 0.9);
      const msPerWord = Math.max(180, (60_000 / wpm) * 1.1);
      let idx = 0;
      setActiveWord(0);
      wordTimerRef.current = setInterval(() => {
        idx += 1;
        if (idx >= words.length) {
          if (wordTimerRef.current) clearInterval(wordTimerRef.current);
          return;
        }
        setActiveWord(idx);
      }, msPerWord);
    },
    [words.length],
  );

  const toggle = useCallback(() => {
    if (playing) {
      stop();
      return;
    }

    if (!window.speechSynthesis) {
      alert("Voice playback is not supported in this browser.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(quote);
    utterance.rate = 0.9;
    utterance.pitch = 0.95;
    utterance.onend = () => stop();
    utterance.onerror = () => stop();

    let boundarySupported = false;
    utterance.onboundary = (event) => {
      boundarySupported = true;
      if (event.name === "word" || event.charIndex >= 0) {
        setActiveWord(wordIndexAtChar(words, event.charIndex));
      }
    };

    utteranceRef.current = utterance;
    setPlaying(true);
    setActiveWord(0);
    window.speechSynthesis.speak(utterance);

    setTimeout(() => {
      if (!boundarySupported && utteranceRef.current) {
        startWordFallback(utterance);
      }
    }, 400);
  }, [playing, quote, stop, startWordFallback, words]);

  return { playing, activeWord, words, toggle, stop };
}
