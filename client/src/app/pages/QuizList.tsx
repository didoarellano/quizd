import { QuizManagerLayout } from "@/components/layouts/QuizManagerLayout";
import { Button } from "@/components/ui/button";
import { QuizListing } from "@/features/quizzes/components/QuizListing";
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
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(min(21rem,100%),1fr))] py-4">
          {quizzes.map((quiz) => (
            <QuizListing key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="h-[calc(100svh-4rem)] flex flex-col gap-4 items-center justify-center">
          <h2 className="text-2xl ">You don't have any quizzes yet</h2>
          <Button size="lg" asChild={true}>
            <Link href="/new">Create one!</Link>
          </Button>
        </div>
      );
      break;
  }

  return <QuizManagerLayout title="My Quizzes">{content}</QuizManagerLayout>;
}
