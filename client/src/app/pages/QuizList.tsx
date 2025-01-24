import { QuizManagerLayout } from "@/components/layouts/QuizManagerLayout";
import { QuizListing } from "@/features/games-as-host/components/QuizListing";
import { useQuizzes } from "@/features/quizzes/queries";
import { useAuth } from "@/utils/AuthContext";
import { ReactNode } from "react";
import { Link } from "wouter";

export function QuizList() {
  const { user } = useAuth();
  const {
    status,
    error,
    data: quizzes,
  } = useQuizzes({
    userID: user?.id ?? null,
  });

  let content: ReactNode = "";
  switch (status) {
    case "pending":
      content = <p>loading...</p>;
      break;

    case "error":
      content = <p>Error: {error.message}</p>;
      break;

    case "success":
      content = quizzes.length ? (
        quizzes.map((quiz) => <QuizListing key={quiz.id} quiz={quiz} />)
      ) : (
        <>
          <p>You don't have any quizzes.</p>
          <Link href="/new">Create one!</Link>
        </>
      );
      break;
  }

  return <QuizManagerLayout title="My Quizzes">{content}</QuizManagerLayout>;
}
