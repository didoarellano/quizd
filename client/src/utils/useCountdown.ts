import { useEffect, useRef, useState } from "react";

export function useCountdown(
  start: number,
  onEnd: () => void
): {
  time: number;
  paused: boolean;
  pauseTimer: () => void;
} {
  const [time, setTime] = useState(start);
  const [isPlaying, setIsPlaying] = useState(true);
  const interval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (isPlaying && time > 0) {
      interval.current = setInterval(() => {
        setTime((prev) => {
          if (prev > 1) return prev - 1;
          onEnd();
          clearInterval(interval.current);
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval.current);
  }, [time, isPlaying, onEnd]);

  return {
    time,
    paused: !isPlaying,
    pauseTimer: () => setIsPlaying((p) => !p),
  };
}
