import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCountdown } from "@/utils/useCountdown";
import { Pause, Play, Timer } from "lucide-react";

type CountdownTimerProps = {
  start: number;
  onEnd: () => void;
};

export function CountdownTimer({ start, onEnd }: CountdownTimerProps) {
  const { time, paused, pauseTimer } = useCountdown(start, onEnd);
  function handleClick() {
    pauseTimer();
  }

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "text-lg shadow",
        time <= 10
          ? "bg-red-500 hover:bg-red-600 text-slate-50"
          : "bg-muted hover:bg-slate-200 text-black"
      )}
    >
      <Timer />
      <span className="tabular-nums">{formatTime(time)}</span>
      {paused ? <Play /> : <Pause />}
    </Button>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remaining
    .toString()
    .padStart(2, "0")}`;
}
