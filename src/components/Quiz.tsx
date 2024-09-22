import { useState } from "react";
import { type Quiz as QuizType } from "../services/quiz";
import { QuestionText } from "./QuestionText";
import { Option } from "./Option";

type QuizProps = {
  quiz: QuizType;
};

export function Quiz({ quiz }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <>
      <h2>{quiz.title}</h2>

      {/* TEMPORARY */}
      {!(quiz.questions.length - 1 === currentQuestionIndex) && (
        <button
          onClick={() => {
            setCurrentQuestionIndex((prevIndex) => {
              return prevIndex + 1;
            });
          }}
        >
          Next
        </button>
      )}
      {/* TEMPORARY */}

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
