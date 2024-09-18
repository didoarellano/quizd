import { useState, type FormEvent, type ChangeEvent } from "react";
import { generateID, type Quiz } from "../services/quiz";

type QuizEditorProps = {
  handleSubmit: (formValues: {}) => void;
  quizData: {};
};

let initialQuizData = {};

export function QuizEditor({
  handleSubmit,
  quizData = initialQuizData,
}: QuizEditorProps) {
  const [formValues, setFormValues] = useState<Partial<Quiz>>(quizData);
  const [questions, setQuestions] = useState(quizData.questions);

  async function onChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formValues === initialQuizData) return;
    const formData = new FormData(e.currentTarget);
    const qs = questions.map(({ id }) => {
      return {
        heading: formData.get(`${id}-heading`),
        body: formData.get(`${id}-body`),
      };
    });
    formValues.questions = qs;
    handleSubmit(formValues);
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" defaultValue={quizData?.title} name="title" />
      <br />
      <textarea
        defaultValue={quizData?.description}
        name="description"
      ></textarea>

      <br />

      <div>
        <h3>Questions</h3>

        <div>
          {questions.map(({ id, heading, body }, i) => {
            return (
              <div key={id}>
                <span>
                  {i + 1} <sup>{id}</sup>{" "}
                </span>
                <p>
                  <label htmlFor={`${id}-heading`}>Heading</label>
                  <input
                    id={`${id}-heading`}
                    name={`${id}-heading`}
                    type="text"
                    defaultValue={heading}
                  />
                </p>
                <p>
                  <label htmlFor={`${id}-body`}>Body</label>
                  <textarea
                    id={`${id}-body`}
                    name={`${id}-body`}
                    defaultValue={body}
                  ></textarea>
                </p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setQuestions((prev) => {
              return [...prev, { id: generateID(), heading: "", body: "" }];
            });
          }}
        >
          Add question
        </button>
      </div>

      <br />
      <button type="submit">Save</button>
    </form>
  );
}
