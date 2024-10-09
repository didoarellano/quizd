import { useEffect, useState } from "react";
import { Link } from "wouter";
import { QuizDeleteButton } from "../components/QuizDeleteButton";
import { useAuth } from "../contexts/AuthContext";
import { getQuizzes, type Quiz } from "../services/quiz";

export function QuizList() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    setIsLoading(true);
    getQuizzes(user.id)
      .then(setQuizzes)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>...</p>;
  }

  function handleDeleteQuiz(deletedQuizId: string) {
    setQuizzes((prevQuizzes) =>
      prevQuizzes.filter((quiz) => quiz.id !== deletedQuizId),
    );
  }

  return (
    <div>
      {quizzes.length < 1 ? (
        <>
          <p>You don't have any quizzes.</p>
          <Link href="/new">Create one!</Link>
        </>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz.id}>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>
            <p>{quiz.questions.length} questions</p>
            <Link href={`/${quiz.id}/host`}>Host Game</Link>
            <Link href={`/${quiz.id}`}>Edit Quiz</Link>
            <QuizDeleteButton
              quizID={quiz.id}
              onDelete={() => handleDeleteQuiz(quiz.id)}
            />
          </div>
        ))
      )}
    </div>
  );
}
