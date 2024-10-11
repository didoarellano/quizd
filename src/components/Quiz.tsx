import { type Quiz as QuizType } from "../services/quiz";
import { QuestionText } from "./QuestionText";
import { Option } from "./Option";

type QuizProps = {
  quiz: QuizType;
  questionIndex: number;
};

export function Quiz({ quiz, questionIndex }: QuizProps) {
  const currentQuestion = quiz.questions[questionIndex];

  return (
    <>
      <h2>{quiz.title}</h2>
      <div>
        <QuestionText
          heading={currentQuestion.heading}
          body={currentQuestion.body}
        />
        <div>
          {currentQuestion.options.map((option) => (
            <Option key={option.id} text={option.text} />
          ))}
        </div>
      </div>
    </>
  );
}
