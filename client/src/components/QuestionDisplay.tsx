import { Question } from "../../../shared/quiz.types";
import { Option } from "./Option";
import { QuestionText } from "./QuestionText";

export function QuestionDisplay({ question }: { question: Question }) {
  return (
    <article>
      <QuestionText heading={question.heading} body={question.body} />
      <div>
        {question.options.map((option) => (
          <Option key={option.id} text={option.text} />
        ))}
      </div>
    </article>
  );
}
