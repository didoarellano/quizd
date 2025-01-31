import { GameLayout } from "@/components/layouts/GameLayout";
import { Leaderboard } from "@/types/game";
import { pluralise } from "@/utils/pluralise";

type GameOverProps = {
  player: Leaderboard[0] | null;
  questionCount: number;
};

export function GameResults({ player, questionCount }: GameOverProps) {
  return (
    <GameLayout
      title="Thanks for playing"
      heading={<GameLayout.Heading>Thanks for playing</GameLayout.Heading>}
      mainContent={
        !player ? (
          <p className="text-gray-500 animate-pulse">Fetching results...</p>
        ) : (
          <p>
            You got {player.score} of {questionCount}{" "}
            {pluralise("question", questionCount)} correct for a total score of{" "}
            <strong>
              {player.score} {pluralise("point", player.score)}
            </strong>
            .
          </p>
        )
      }
    />
  );
}
