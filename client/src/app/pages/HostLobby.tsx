import { PlayerList } from "@/features/games-as-host/components/PlayerList";
import { useGameAsHost, useStartGame } from "@/features/games-as-host/queries";
import { GameStatus } from "@/types/game";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Link, useLocation } from "wouter";

const startButtonText = {
  [GameStatus.PENDING]: "Start Game",
  [GameStatus.ONGOING]: "Continue Game",
  [GameStatus.COMPLETED]: "View Results",
};

export function HostLobby({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost({ quizID });
  const startGame = useStartGame({ game: game ?? null });
  const players = game?.players;
  const [location] = useLocation();

  useDocumentTitle(`Host ${game?.quiz.title ?? "Quiz"}`);

  return (
    <>
      <h1>Host Lobby</h1>
      <Link href={`${location}/play`}>Play</Link>
      <Link href={`${location}/results`}>Results</Link>
      {game && (
        <>
          <h2>{game.quiz.title}</h2>
          <p>{game.quiz.description}</p>
          <Link href={`${location}/play`} onClick={() => startGame.mutate()}>
            {startButtonText[game.status]}
          </Link>
        </>
      )}
      <p>Go to: {window.location.href.replace(/host\/.*/i, "play")}</p>
      <p>Enter PIN: {game?.pin}</p>

      {players && <PlayerList players={players} />}
    </>
  );
}
