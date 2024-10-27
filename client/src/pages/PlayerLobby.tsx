import { Redirect, useParams } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { useAuth } from "../contexts/AuthContext";
import { useGameAsPlayer } from "../utils/useGame";

export function PlayerLobby() {
  const { user } = useAuth();
  const { pin } = useParams();
  const { data } = useGameAsPlayer(pin);

  if (!pin) return <Redirect to="/" />;

  if (data?.game.status === GameStatus.PENDING) {
    return (
      <>
        <p>Welcome {user?.displayName}!</p>
        <p>Waiting for host to start the game.</p>
      </>
    );
  }

  if (data?.game?.status === GameStatus.ONGOING) {
    return <p>Current Question: {data.game.currentQuestionIndex}</p>;
  }

  return <p>...</p>;
}
