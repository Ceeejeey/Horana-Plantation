import { useCallback, useEffect, useRef, useState } from "react";

const LEADERSHIP_AUDIO_STOP = "leadership-audio-stop";

export function useLeadershipNarration(audioSrc: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
  }, []);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    const onEnded = () => setPlaying(false);
    const onError = () => setPlaying(false);
    const onExternalStop = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (detail !== audioSrc) stop();
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    window.addEventListener(LEADERSHIP_AUDIO_STOP, onExternalStop);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      window.removeEventListener(LEADERSHIP_AUDIO_STOP, onExternalStop);
      audioRef.current = null;
    };
  }, [audioSrc, stop]);

  useEffect(() => () => stop(), [stop]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      stop();
      return;
    }

    window.dispatchEvent(new CustomEvent(LEADERSHIP_AUDIO_STOP, { detail: audioSrc }));
    audio.currentTime = 0;
    void audio.play()
      .then(() => setPlaying(true))
      .catch(() => {
        setPlaying(false);
      });
  }, [playing, audioSrc, stop]);

  return { playing, toggle, stop };
}
