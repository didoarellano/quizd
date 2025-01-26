import { Button } from "@/components/ui/button";
import { HostGameButton } from "@/features/quizzes/components/HostGameButton";
import { QuizDeleteButton } from "@/features/quizzes/components/QuizDeleteButton";
import { useDeleteQuiz } from "@/features/quizzes/queries";
import { Quiz } from "@/types/quiz";
import { Link } from "wouter";

export function QuizListing({ quiz }: { quiz: Quiz }) {
  const deleteQuiz = useDeleteQuiz();
  return (
    <div
      key={quiz.id}
      className="flex flex-col gap-2 justify-between p-4 shadow-md border rounded-sm"
    >
      <div>
        <h2 className="text-xl font-bold">{quiz.title}</h2>
        <p>{quiz.description}</p>
        <p className="text-slate-600">{quiz.questions?.length} questions</p>
      </div>
      <div className="flex gap-2 justify-end pt-2 border-t-2">
        <QuizDeleteButton onDeleteClick={() => deleteQuiz.mutate(quiz.id)} />
        <HostGameButton quizID={quiz.id} />
        <Button size="sm" asChild={true}>
          <Link href={`/${quiz.id}`}>Edit</Link>
        </Button>
      </div>
    </div>
  );
}
