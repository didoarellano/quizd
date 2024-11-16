import { useQuery } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import { EndGameResponse } from "../../../shared/game.types";
import { functions } from "../services/firebase";

const endGame = httpsCallable<string, EndGameResponse>(functions, "endGame");

export function GameResults({ quizID }: { quizID: string }) {
  const { data } = useQuery({
    queryKey: ["gameResults", quizID],
    queryFn: () => endGame(quizID).then((response) => response.data),
  });

  if (!data) return <p>...</p>;

  const { leaderboard, quiz } = data;

  return (
    <>
      <h1>Game Results</h1>
      <h2>{quiz.title}</h2>
      <h3>{quiz.description}</h3>

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
