import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { Link } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { db } from "../services/firebase";
import { useGameAsHost } from "../utils/useGame";

const startButtonText = {
  [GameStatus.PENDING]: "Start Game",
  [GameStatus.ONGOING]: "Continue Game",
  [GameStatus.COMPLETED]: "View Results",
};

export function HostLobby({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);
  const currentQuestionIndex =
    game?.activeGameChannel.currentQuestionIndex ?? 0;
  const players = game?.players;

  const { mutate: updateGameStatus } = useMutation({
    mutationFn: async () => {
      if (game && game.status === GameStatus.PENDING) {
        const gameRef = doc(db, "games", game.id);
        const activeGameChannelRef = doc(db, "activeGamesChannel", game.id);
        return Promise.all([
          updateDoc(gameRef, { status: GameStatus.ONGOING }),
          updateDoc(activeGameChannelRef, {
            status: GameStatus.ONGOING,
            currentQuestionIndex,
          }),
        ]);
      }
    },
  });

  return (
    <>
      <h1>Host Lobby</h1>
      <Link href="/play">Play</Link>
      <Link href="/results">Results</Link>
      {game && (
        <>
          <h2>{game.quiz.title}</h2>
          <p>{game.quiz.description}</p>
          <Link href="/play" onClick={() => updateGameStatus()}>
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
