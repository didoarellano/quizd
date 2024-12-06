import { HostGameButton } from "@/features/quizzes/components/HostGameButton";
import { QuizDeleteButton } from "@/features/quizzes/components/QuizDeleteButton";
import { useDeleteQuiz } from "@/features/quizzes/queries";
import { Quiz } from "@/types/quiz";
import { Link } from "wouter";

export function QuizListing({ quiz }: { quiz: Quiz }) {
  const deleteQuiz = useDeleteQuiz();
  return (
    <div key={quiz.id}>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>
      <p>{quiz.questions?.length} questions</p>
      <HostGameButton quizID={quiz.id} />
      <Link href={`/${quiz.id}`}>Edit Quiz</Link>
      <QuizDeleteButton onDeleteClick={() => deleteQuiz.mutate(quiz.id)} />
    </div>
  );
}
