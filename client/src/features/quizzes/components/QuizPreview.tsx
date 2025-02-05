import { QuestionDisplay } from "@/features/quizzes/components/QuestionDisplay";
import { Quiz } from "@/types/quiz";
import { Timer } from "lucide-react";

export function QuizPreview({ quiz }: { quiz: Quiz }) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-2 md:hidden">Preview</h3>
      <ol className="grid gap-8">
        {quiz.questions.map((q) => (
          <li key={q.id}>
            <QuestionDisplay question={q}>
              <div className="flex gap-2 items-start">
                <QuestionDisplay.Heading>{q.heading}</QuestionDisplay.Heading>
                <div className="w-fit p-2 flex gap-2 items-center text-sm bg-muted rounded-sm">
                  <Timer size={20} />
                  {q.duration}s
                </div>
              </div>
              {q.body && <QuestionDisplay.Body>{q.body}</QuestionDisplay.Body>}
              <QuestionDisplay.Options
                questionID={q.id}
                options={q.options}
                answerKey={q.answers}
              />
            </QuestionDisplay>
          </li>
        ))}
      </ol>
    </>
  );
}
