import { type Quiz as QuizType } from "../services/quiz";
import { QuestionText } from "./QuestionText";
import { Option } from "./Option";

type QuizProps = {
  quiz: QuizType;
};

export function Quiz({ quiz }: QuizProps) {
  return (
    <>
      <h2>{quiz.title}</h2>
      <ol>
        {quiz.questions.map((question) => {
          return (
            <li key={question.id}>
              <QuestionText heading={question.heading} body={question.body} />
              <div>
                {question.options.map((option) => (
                  <Option key={option.id} text={option.text} />
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
