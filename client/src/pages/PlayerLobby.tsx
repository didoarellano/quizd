import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Redirect, useParams } from "wouter";
import { GameStatus } from "../../../shared/game.types";
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
    },
  });
  const [currentAnswer, setCurrentAnswer] = useState("");

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
    const savedAnswer =
      currentQuestion?.questionID === question.id
        ? currentQuestion.answerID
        : "";

    return (
      <QuestionDisplay
        key={question.id}
        question={question}
        onOptionClick={(questionID: string, answerID: string) => {
          setCurrentAnswer(answerID);
          saveAnswer({ questionID, answerID });
        }}
        activeOptionID={currentAnswer || savedAnswer}
      />
    );
  }

  return <p>...</p>;
}
