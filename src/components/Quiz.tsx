import { Markdown } from "./Markdown";
import { type Quiz as QuizType } from "../services/quiz";

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
              <Markdown>{question.heading}</Markdown>
              <Markdown>{question.body}</Markdown>
              <div>
                {question.options.map((option) => {
                  return (
                    <div
                      key={option.id}
                      style={{
                        padding: "10px 20px",
                        border: "1px solid #333",
                        cursor: "pointer",
                      }}
                    >
                      <Markdown>{option.text}</Markdown>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
