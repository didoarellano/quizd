import { HostGameButton } from "@/features/quizzes/components/HostGameButton";
import { QuizDeleteButton } from "@/features/quizzes/components/QuizDeleteButton";
import { useDeleteQuiz, useQuizzes } from "@/features/quizzes/queries";
import { useAuth } from "@/utils/AuthContext";
import { Link } from "wouter";

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
            <HostGameButton quizID={quiz.id} />
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
