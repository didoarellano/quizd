import { useState, type FormEvent, type ChangeEvent } from "react";
import { type Quiz } from "../services/quiz";

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
    handleSubmit(formValues);
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={formValues?.title}
        onChange={onChange}
        name="title"
      />
      <br />
      <textarea
        value={formValues?.description}
        onChange={onChange}
        name="description"
      ></textarea>
      <button type="submit">Save</button>
    </form>
  );
}
