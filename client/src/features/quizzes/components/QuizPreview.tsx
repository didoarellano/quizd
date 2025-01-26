import { QuestionDisplay } from "@/features/quizzes/components/QuestionDisplay";
import { Quiz } from "@/types/quiz";

export function QuizPreview({ quiz }: { quiz: Quiz }) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-2 md:hidden">Preview</h3>
      <ol className="grid gap-8">
        {quiz.questions.map((q) => (
          <li key={q.id}>
            <QuestionDisplay question={q}>
              <QuestionDisplay.Heading>{q.heading}</QuestionDisplay.Heading>
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
