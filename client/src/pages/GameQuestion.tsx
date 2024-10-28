import { useMutation } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { Link, Redirect, useSearch } from "wouter";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { db } from "../services/firebase";
import { useGameAsHost } from "../utils/useGame";

export function GameQuestion({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);
  const { mutate: updateCurrentQuestionIndex } = useMutation({
    mutationFn: (currentQuestionIndex: number) => {
      if (!game) return Promise.resolve();
      const gameRef = doc(db, "games", game.id);
      return updateDoc(gameRef, { currentQuestionIndex });
    },
  });
  const searchParams = useSearch();
  const currentIndex = Number(
    Object.fromEntries(new URLSearchParams(searchParams))?.q,
  );

  useEffect(() => {
    updateCurrentQuestionIndex(currentIndex);
  }, [currentIndex, updateCurrentQuestionIndex]);

  if (!game || !searchParams) return <Redirect to={`/`} />;

  const questions = game.quiz.questions;
  const question = questions && questions[currentIndex];
  const nextIndex = currentIndex + 1 < questions.length && currentIndex + 1;

  return (
    <>
      <h1>Current Question</h1>
      <Link href="/">Host Lobby</Link>
      <Link href="/results">Results</Link>

      <br />
      {nextIndex && <Link href={`/play?q=${nextIndex}`}>Next Question</Link>}

      <QuestionDisplay key={question.id} question={question} />
    </>
  );
}
