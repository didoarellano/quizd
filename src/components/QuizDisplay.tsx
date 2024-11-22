import { Option } from "@/components/Option";
import { QuestionText } from "@/components/QuestionText";
import { Quiz } from "@/types/quiz";

type QuizProps = {
  quiz: Quiz;
  questionIndex: number;
};

export function QuizDisplay({ quiz, questionIndex }: QuizProps) {
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
