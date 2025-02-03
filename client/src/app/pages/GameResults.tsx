import { GameLayout } from "@/components/layouts/GameLayout";
import { LeaderboardDisplay } from "@/features/games-as-host/components/Leaderboard";
import { useGameResults } from "@/features/games-as-host/queries";

export function GameResults({ quizID }: { quizID: string }) {
  const { data } = useGameResults({
    quizID,
  });

  if (!data) return <p>...</p>;

  const { leaderboard, quiz } = data;

  return (
    <GameLayout
      title={`${quiz.title} Results`}
      heading={<GameLayout.Heading>{quiz.title}</GameLayout.Heading>}
      mainContent={<LeaderboardDisplay leaderboard={leaderboard} />}
    ></GameLayout>
  );
}
