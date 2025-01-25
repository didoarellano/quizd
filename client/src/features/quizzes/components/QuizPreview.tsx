import { Markdown } from "@/components/Markdown";
import { QuestionText } from "@/components/QuestionText";
import { Quiz } from "@/types/quiz";

export function QuizPreview({ quiz }: { quiz: Quiz }) {
  return (
    <>
      <h3 className="text-2xl font-bold mb-2 md:hidden">Preview</h3>
      <ol className="grid gap-8">
        {quiz.questions.map((q) => (
          <li key={q.id}>
            <QuestionText heading={q.heading} body={q.body} />
            <ul className="grid gap-2 mt-4">
              {q.options.map((option) => (
                <li key={option.id} className="p-4 border">
                  <label>
                    <Markdown>{option.text}</Markdown>
                    <input type="radio" name={q.id} className="hidden" />
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );
}
