import { Link } from "wouter";
import { useGame } from "../utils/useGame";

export function HostLobby({ quizID }: { quizID: string }) {
  const { data: game } = useGame(quizID);
  const players = game?.players;
  const q = game?.currentQuestionIndex ?? 0;

  return (
    <>
      <h1>Host Lobby</h1>
      <Link href="/play">Play</Link>
      <Link href="/results">Results</Link>
      <h2>{game?.quizData.title}</h2>
      <p>{game?.quizData.description}</p>
      <p>Go to: {window.location.href.replace(/host\/.*/i, "play")}</p>
      <p>Enter PIN: {game?.pin}</p>
      <Link href={`/play?q=${q}`}>
        {q === 0 ? "Start Game" : "Continue Game"}
      </Link>
      <div>
        <h3>Players</h3>
        <ul>
          {players && players.map((player) => <li key={player}>{player}</li>)}
        </ul>
      </div>
    </>
  );
}
