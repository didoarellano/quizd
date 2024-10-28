import { Redirect, useParams } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { Option } from "../components/Option";
import { QuestionText } from "../components/QuestionText";
import { useAuth } from "../contexts/AuthContext";
import { useGameAsPlayer } from "../utils/useGame";

export function PlayerLobby() {
  const { user } = useAuth();
  const { pin } = useParams();
  const { data } = useGameAsPlayer(pin || "");

  if (!pin) return <Redirect to="/" />;

  if (!data) {
    // TODO redirect?
    return <p>Game not found.</p>;
  }

  if (data.game.status === GameStatus.PENDING) {
    return (
      <>
        <p>Welcome {user?.displayName}!</p>
        <p>Waiting for host to start the game.</p>
      </>
    );
  }

  if (data.game.status === GameStatus.ONGOING) {
    const question = data.quiz.questions[data.game.currentQuestionIndex];
    return (
      <article>
        <QuestionText heading={question.heading} body={question.body} />
        <div>
          {question.options.map((option) => (
            <Option key={option.id} text={option.text} />
          ))}
        </div>
      </article>
    );
  }

  return <p>...</p>;
}
