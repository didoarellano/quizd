import { Player } from "@/types/game";
import { UserRound } from "lucide-react";

export function PlayerList({
  players,
  className = "",
}: {
  players: Player[];
  className?: string;
}) {
  return (
    <ul className={className}>
      {players.map((player) => (
        <li
          key={player.id}
          className="h-14 p-1 flex gap-2 items-center bg-slate-100 shadow rounded-sm"
        >
          <span className="h-full bg-teal-600 text-slate-100 rounded-sm">
            <UserRound size={"100%"} />
          </span>
          <span className="text-xl">{player.displayName}</span>
        </li>
      ))}
    </ul>
  );
}
