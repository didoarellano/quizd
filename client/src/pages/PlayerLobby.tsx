import { Redirect, useParams } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { useAuth } from "../contexts/AuthContext";
import { useGameAsPlayer } from "../utils/useGame";

export function PlayerLobby() {
  const { user } = useAuth();
  const { pin } = useParams();
  const { data, isPending } = useGameAsPlayer(pin || "");

  if (!pin) return <Redirect to="/" />;

  if (isPending) {
    return <p>...</p>;
  }

  if (!data) {
    // TODO redirect?
    return <p>Game not found.</p>;
  }

  if (data.activeGameChannel.status === GameStatus.PENDING) {
    return (
      <>
        <p>Welcome {user?.displayName}!</p>
        <p>Waiting for host to start the game.</p>
      </>
    );
  }

  if (data.activeGameChannel.status === GameStatus.ONGOING) {
    const question =
      data.quiz.questions[data.activeGameChannel.currentQuestionIndex];
    return <QuestionDisplay key={question.id} question={question} />;
  }

  return <p>...</p>;
}
