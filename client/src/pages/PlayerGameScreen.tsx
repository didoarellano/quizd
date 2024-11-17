import { Redirect, useParams } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { Markdown } from "../components/Markdown";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { useAuth } from "../contexts/AuthContext";
import {
  useGameAsPlayer,
  useSaveAnswerMutation,
} from "../utils/useGameAsPlayer";

export function PlayerGameScreen() {
  const { user } = useAuth();
  const { pin } = useParams();
  const { data, isPending } = useGameAsPlayer(pin || "");

  const saveAnswer = useSaveAnswerMutation({
    docPath: `games/${data?.gameID}/players/${user?.id}`,
    queryKey: ["games", pin || ""],
  });

  if (!pin) return <Redirect to="/" />;

  if (isPending) {
    return <p>...</p>;
  }

  if (!data) {
    // TODO redirect?
    return <p>Game not found.</p>;
  }

  if (!user) {
    return <p>User not logged in</p>;
  }

  if (data.activeGameChannel.status === GameStatus.PENDING) {
    return (
      <>
        <p>Welcome {user?.displayName}!</p>
        <p>Waiting for host to start the game.</p>
      </>
    );
  }

  const answerKey = data.activeGameChannel?.currentQuestionAnswer;
  const questionIsClosed = !!answerKey;
  const question =
    data.quiz.questions[data.activeGameChannel.currentQuestionIndex];
  const currentAnswerID = data.answers[question.id];

  if (
    data.activeGameChannel.status === GameStatus.ONGOING &&
    questionIsClosed
  ) {
    const correctAnswers = question.options.filter((o) =>
      answerKey.includes(o.id)
    );
    const playerAnswer = question.options.find((o) => o.id === currentAnswerID);
    const isCorrect = answerKey.includes(currentAnswerID);

    return (
      <>
        <h3>Correct answer(s):</h3>
        {correctAnswers.map((option) => (
          <Markdown key={option.id}>{option.text}</Markdown>
        ))}
        {playerAnswer && (
          <>
            <h3>Your answer</h3>
            <Markdown>{playerAnswer.text}</Markdown>
            <p>is {isCorrect ? "correct" : "incorrect"}</p>
          </>
        )}
      </>
    );
  }

  if (data.activeGameChannel.status === GameStatus.ONGOING) {
    return (
      <QuestionDisplay
        key={question.id}
        question={question}
        onOptionClick={(questionID: string, answerID: string) => {
          saveAnswer.mutate({ questionID, answerID });
        }}
        activeOptionID={currentAnswerID}
      />
    );
  }

  if (
    data.activeGameChannel.status === GameStatus.COMPLETED &&
    data.activeGameChannel.leaderboard
  ) {
    const thisPlayer = data.activeGameChannel.leaderboard.find(
      (player) => player.id === user.id
    );

    return (
      <>
        <h1>Results</h1>
        {thisPlayer && <p>You scored {thisPlayer.score} points</p>}
      </>
    );
  }

  return <p>...</p>;
}
