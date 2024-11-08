import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Redirect, useParams } from "wouter";
import { GameStatus } from "../../../shared/game.types";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";
import { useGameAsPlayer } from "../utils/useGame";

export function PlayerLobby() {
  const { user } = useAuth();
  const { pin } = useParams();
  const { data, isPending } = useGameAsPlayer(pin || "");
  const { mutate: saveAnswer } = useMutation({
    mutationFn: async ({
      questionID,
      answerID,
    }: {
      questionID: string;
      answerID: string;
    }) => {
      if (!data || !user) return;
      const playerDocRef = doc(db, "games", data.gameID, "players", user.id);
      return updateDoc(playerDocRef, {
        [`answers.${questionID}`]: answerID,
      });
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

    return (
      <QuestionDisplay
        key={question.id}
        question={question}
        onOptionClick={(questionID: string, answerID: string) => {
          setCurrentAnswer(answerID);
          saveAnswer({ questionID, answerID });
        }}
        activeOptionID={currentAnswer}
      />
    );
  }

  return <p>...</p>;
}
