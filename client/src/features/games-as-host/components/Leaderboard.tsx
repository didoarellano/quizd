import { Leaderboard } from "@/types/game";

export function LeaderboardDisplay({
  leaderboard,
}: {
  leaderboard: Leaderboard;
}) {
  return (
    <div>
      <h1>Leaderboard</h1>
      {leaderboard && (
        <ol>
          {leaderboard.map((player) => (
            <li key={player.id}>
              {player.displayName} ({player.score} points)
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
