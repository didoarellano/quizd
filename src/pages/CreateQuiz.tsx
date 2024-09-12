import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { DocumentData } from "firebase/firestore";
import { useLocation, useRouter } from "wouter";

import { saveNewQuiz } from "../services/quiz";
import { useAuth } from "../contexts/AuthContext";
import { Teacher } from "../services/auth";

type CreateQuizProps = {
  quizID?: string;
};

let initialQuizData = {};

export function CreateQuiz({ quizID }: CreateQuizProps) {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const [quizData, setQuizData] = useState<DocumentData>(initialQuizData);
  const [, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (quizData === initialQuizData) return;
    const quizDocRef = await saveNewQuiz(user as Teacher, quizData);
    const loc = `~${base}/${quizDocRef.id}`;
    setLocation(loc, { replace: true });
  }

  async function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: value,
    });
  }

  return (
    <>
      <h1>{!quizID ? "Create Quiz" : `Editing Quiz: ${quizID}`}</h1>
      <form onSubmit={onSubmit}>
        <textarea
          value={quizData?.title}
          onChange={onChange}
          name="title"
          ref={titleRef}
        ></textarea>
        <br />
        <button type="submit">Save</button>
      </form>
    </>
  );
}
