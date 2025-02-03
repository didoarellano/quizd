import { Leaderboard } from "@/types/game";
import { pluralise } from "@/utils/pluralise";
import { Trophy } from "lucide-react";

export function LeaderboardDisplay({
  leaderboard,
}: {
  leaderboard: Leaderboard;
}) {
  return (
    <div className="text-xl">
      {leaderboard && (
        <ol className="grid gap-4">
          {leaderboard.slice(0, 3).map((player) => (
            <li
              key={player.id}
              className="p-4 flex items-center gap-4 bg-yellow-400 rounded-sm"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted">
                <Trophy size={32} className="stroke-yellow-700" />
              </div>
              <div>
                <h2 className="font-bold">{player.displayName}</h2>
                <p className="text-lg text-muted-foreground">
                  {player.score} {pluralise("point", player.score)}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
