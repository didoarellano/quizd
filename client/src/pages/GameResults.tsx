import { Link, Redirect } from "wouter";
import { useGame } from "../utils/useGame";

export function GameResults({ quizID }: { quizID: string }) {
  const { data: game } = useGame(quizID);

  if (!game) return <Redirect to={`/`} />;

  return (
    <>
      <h1>Game Results</h1>
      <Link href="/">Host Lobby</Link>
      <Link href="/play">Play</Link>
    </>
  );
}
