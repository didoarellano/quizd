import { useQuery } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import { Leaderboard } from "../../../shared/game.types";
import { functions } from "../services/firebase";
import { useGameAsHost } from "../utils/useGame";

const endGame = httpsCallable<string, Leaderboard>(functions, "endGame");

export function GameResults({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);
  const { data: leaderboard } = useQuery({
    queryKey: ["leaderboard", quizID],
    queryFn: () => endGame(quizID).then((response) => response.data),
  });

  if (!game) return <p>...</p>;

  return (
    <>
      <h1>Game Results</h1>
      <h2>{game.quiz.title}</h2>
      <h3>{game.quiz.description}</h3>

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
    </>
  );
}
