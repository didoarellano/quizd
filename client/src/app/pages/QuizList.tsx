import { QuizListing } from "@/features/games-as-host/components/QuizListing";
import { useQuizzes } from "@/features/quizzes/queries";
import { useAuth } from "@/utils/AuthContext";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Link } from "wouter";

export function QuizList() {
  useDocumentTitle("My Quizzes");

  const { user } = useAuth();
  const {
    isPending,
    isError,
    error,
    data: quizzes,
  } = useQuizzes({
    userID: user?.id ?? null,
  });

  if (isPending) {
    return <p>loading...</p>;
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {quizzes.length ? (
        quizzes.map((quiz) => <QuizListing key={quiz.id} quiz={quiz} />)
      ) : (
        <>
          <p>You don't have any quizzes.</p>
          <Link href="/new">Create one!</Link>
        </>
      )}
    </div>
  );
}
