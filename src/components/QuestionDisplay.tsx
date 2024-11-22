import { Question } from "../types/quiz";
import { Option } from "./Option";
import { QuestionText } from "./QuestionText";

type QuestionDisplayProps = {
  question: Question;
  onOptionClick?: (questionID: string, answerID: string) => void;
  activeOptionID?: string;
};

export function QuestionDisplay({
  question,
  onOptionClick,
  activeOptionID,
}: QuestionDisplayProps) {
  function handleOptionClick(optionID: string) {
    onOptionClick && onOptionClick(question.id, optionID);
  }

  return (
    <article>
      <QuestionText heading={question.heading} body={question.body} />
      <div>
        {question.options.map((option) => (
          <Option
            key={option.id}
            text={option.text}
            isActive={activeOptionID === option.id}
            onClick={
              onOptionClick ? () => handleOptionClick(option.id) : undefined
            }
          />
        ))}
      </div>
    </article>
  );
}
