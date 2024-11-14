import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Link, Redirect, useSearch } from "wouter";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { db } from "../services/firebase";
import { useGameAsHost } from "../utils/useGame";

export function GameQuestion({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);

  const startNewQuestionRoundMutation = useMutation({
    mutationFn: async (currentQuestionIndex: number) => {
      if (!game) return;
      const activeGameChannelRef = doc(db, "activeGamesChannel", game.id);
      return updateDoc(activeGameChannelRef, {
        currentQuestionIndex,
        currentQuestionAnswer: null,
      });
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

  const searchParams = useSearch();
  const currentIndex = Number(
    Object.fromEntries(new URLSearchParams(searchParams))?.q
  );

  useEffect(() => {
    startNewQuestionRoundMutation.mutate(currentIndex);
    closeQuestionRoundMutation.reset();
  }, [currentIndex]);

  if (!game || !searchParams) return <Redirect to={`/`} />;

  const questions = game.quiz.questions;
  const question = questions[currentIndex];
  const nextIndex = currentIndex + 1 < questions.length && currentIndex + 1;

  return (
    <>
      <h1>Current Question</h1>
      <Link href="/">Host Lobby</Link>
      <Link href="/results">Results</Link>

      <br />
      {nextIndex && <Link href={`/play?q=${nextIndex}`}>Next Question</Link>}

      <button onClick={() => closeQuestionRoundMutation.mutate(question.id)}>
        Close Question
      </button>

      <QuestionDisplay key={question.id} question={question} />
    </>
  );
}
