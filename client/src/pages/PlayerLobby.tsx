import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Redirect, useParams } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { Markdown } from "../components/Markdown";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { useGameAsPlayer } from "../utils/useGame";

type SavedCurrentQuestion = {
  questionID: string;
  answerID: string;
};
const savedQuestion = localStorage.getItem("currentQuestion");
const currentQuestion: SavedCurrentQuestion | null = savedQuestion
  ? JSON.parse(savedQuestion)
  : null;

export function PlayerLobby() {
  const { user } = useAuth();
  const { pin } = useParams();
  const { data, isPending } = useGameAsPlayer(pin || "");
  const [currentAnswerID, setCurrentAnswerID] = useState("");
  const { mutate: saveAnswer } = useMutation({
    mutationFn: async ({ questionID, answerID }: SavedCurrentQuestion) => {
      if (!data || !user) return;
      const playerDocRef = doc(db, "games", data.gameID, "players", user.id);
      return updateDoc(playerDocRef, {
        [`answers.${questionID}`]: answerID,
      });
    },
    onSuccess: (_, vars) => {
      localStorage.setItem("currentQuestion", JSON.stringify(vars));
      setCurrentAnswerID(vars.answerID);
    },
  });

  useEffect(() => {
    setCurrentAnswerID("");
  }, [data?.activeGameChannel.currentQuestionIndex]);

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

  const answerKey = data.activeGameChannel?.currentQuestionAnswer;
  const questionIsClosed = !!answerKey;
  const question =
    data.quiz.questions[data.activeGameChannel.currentQuestionIndex];

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
          setCurrentAnswerID(answerID);
          saveAnswer({ questionID, answerID });
        }}
        activeOptionID={currentAnswerID}
      />
    );
  }

  return <p>...</p>;
}
