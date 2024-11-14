import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { db } from "../services/firebase";
import { useGameAsHost } from "../utils/useGame";

export function HostQuestion({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | undefined
  >(game?.activeGameChannel.currentQuestionIndex);

  useEffect(() => {
    const idx = game && game.activeGameChannel.currentQuestionIndex;
    if (idx !== undefined) setCurrentQuestionIndex(idx);
  }, [game]);

  const startNewQuestionRoundMutation = useMutation({
    mutationFn: async (currentQuestionIndex: number) => {
      if (!game) return;
      const activeGameChannelRef = doc(db, "activeGamesChannel", game.id);
      return updateDoc(activeGameChannelRef, {
        currentQuestionIndex,
        currentQuestionAnswer: null,
      });
    },
    onSuccess: () => {
      nextIndex && setCurrentQuestionIndex(nextIndex);
    },
  });

  const closeQuestionRoundMutation = useMutation({
    mutationFn: async (questionID: string) => {
      if (!game) return;
      const currentQuestionAnswer = game.answerKey[questionID];
      const activeGameChannelRef = doc(db, "activeGamesChannel", game.id);
      return updateDoc(activeGameChannelRef, { currentQuestionAnswer });
    },
  });

  if (!game) return <p>...</p>;

  const currentIndex =
    currentQuestionIndex ?? game.activeGameChannel.currentQuestionIndex;
  const questions = game.quiz.questions;
  const question = questions[currentIndex];
  const nextIndex = currentIndex + 1 < questions.length && currentIndex + 1;

  return (
    <>
      <h1>Current Question</h1>
      <Link href="/">Host Lobby</Link>
      <Link href="/results">Results</Link>

      <br />
      <button onClick={() => closeQuestionRoundMutation.mutate(question.id)}>
        Close Question
      </button>

      <br />
      {nextIndex && (
        <button onClick={() => startNewQuestionRoundMutation.mutate(nextIndex)}>
          Next Question
        </button>
      )}

      <QuestionDisplay key={question.id} question={question} />
    </>
  );
}
