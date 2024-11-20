import { Link } from "wouter";
import { QuizDeleteButton } from "../components/QuizDeleteButton";
import { useAuth } from "../contexts/AuthContext";
import { useDeleteQuiz, useQuizzes } from "../utils/useQuiz";

export function QuizList() {
  const { user } = useAuth();
  const {
    isPending,
    isError,
    error,
    data: quizzes,
  } = useQuizzes({
    userID: user?.id ?? null,
  });
  const deleteQuiz = useDeleteQuiz();

  if (isPending) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
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
            <p>{quiz.questions?.length} questions</p>
            <Link href={`~${import.meta.env.VITE_BASE_URL}/host/${quiz.id}`}>
              Host Game
            </Link>
            <Link href={`/${quiz.id}`}>Edit Quiz</Link>
            <QuizDeleteButton
              onDeleteClick={() => quiz?.id && deleteQuiz.mutate(quiz.id)}
            />
          </div>
        ))
      )}
    </div>
  );
}
