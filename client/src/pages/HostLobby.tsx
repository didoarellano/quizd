import { Link } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { useGameAsHost, useStartGameMutation } from "../utils/useGameAsHost";

const startButtonText = {
  [GameStatus.PENDING]: "Start Game",
  [GameStatus.ONGOING]: "Continue Game",
  [GameStatus.COMPLETED]: "View Results",
};

export function HostLobby({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);
  const startGame = useStartGameMutation({ game });
  const players = game?.players;

  return (
    <>
      <h1>Host Lobby</h1>
      <Link href="/play">Play</Link>
      <Link href="/results">Results</Link>
      {game && (
        <>
          <h2>{game.quiz.title}</h2>
          <p>{game.quiz.description}</p>
          <Link href="/play" onClick={() => startGame.mutate()}>
            {startButtonText[game.status]}
          </Link>
        </>
      )}
      <p>Go to: {window.location.href.replace(/host\/.*/i, "play")}</p>
      <p>Enter PIN: {game?.pin}</p>
      <div>
        <h3>Players</h3>
        <ul>
          {players &&
            players.map((player) => (
              <li key={player.id}>{player.displayName}</li>
            ))}
        </ul>
      </div>
    </>
  );
}
