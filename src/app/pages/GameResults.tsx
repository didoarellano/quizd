import { useGameResults } from "../../features/games-as-host/queries";

export function GameResults({ quizID }: { quizID: string }) {
  const { data } = useGameResults({
    quizID,
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
