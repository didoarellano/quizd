import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { Link } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { db } from "../services/firebase";
import { useGame } from "../utils/useGame";

const startButtonText = {
  [GameStatus.PENDING]: "Start Game",
  [GameStatus.ONGOING]: "Continue Game",
  [GameStatus.COMPLETED]: "View Results",
};

export function HostLobby({ quizID }: { quizID: string }) {
  const { data: game } = useGame(quizID);
  const { mutate: updateGameStatus } = useMutation({
    mutationFn: () => {
      if (game && game.status === GameStatus.PENDING) {
        const gameRef = doc(db, "games", game.id);
        return updateDoc(gameRef, { status: GameStatus.ONGOING });
      }
      return Promise.resolve();
    },
  });

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
      <Link href={`/play?q=${q}`} onClick={() => updateGameStatus()}>
        {startButtonText[game?.status]}
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
