import { useEffect, useState } from "react";

import { getQuiz, type Quiz as QuizType } from "../services/quiz";
import { Quiz } from "../components/Quiz";

type PlayQuizProps = {
  quizID: string;
};

export function PlayQuiz({ quizID }: PlayQuizProps) {
  const [quizData, setQuizData] = useState<QuizType | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);

  useEffect(() => {
    async function loadQuiz(quizID: string) {
      const _quizSnap = await getQuiz(quizID);

      if (_quizSnap.exists()) {
        setQuizData(_quizSnap.data() as QuizType);
      } else {
        // TODO: 404
      }

      setIsLoadingQuiz(false);
    }

    setIsLoadingQuiz(true);
    loadQuiz(quizID);
  }, []);

  return (
    <>
      <h1>Play</h1>
      {isLoadingQuiz || !quizData ? <p>...</p> : <Quiz quiz={quizData} />}
    </>
  );
}
