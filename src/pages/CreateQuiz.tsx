import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { useLocation, useRouter } from "wouter";

import { getQuiz, saveNewQuiz, updateQuiz } from "../services/quiz";
import { useAuth } from "../contexts/AuthContext";
import { Teacher, UserRoles } from "../services/auth";

type CreateQuizProps = {
  quizID?: string;
};

let initialQuizData = {};

export function CreateQuiz({ quizID }: CreateQuizProps) {
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const quizSnap = useRef<DocumentSnapshot | null>(null);
  const [quizData, setQuizData] = useState<DocumentData>(initialQuizData);
  const [, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function loadQuiz(quizID: string) {
      if (!user?.id || user?.role !== UserRoles.Teacher) return;
      const _quizSnap = await getQuiz(quizID);

      if (_quizSnap.exists()) {
        quizSnap.current = _quizSnap;
        setQuizData(_quizSnap.data());
      }
    }

    if (quizID) loadQuiz(quizID);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (quizData === initialQuizData) return;

    if (!quizID) {
      const quizDocRef = await saveNewQuiz(user as Teacher, quizData);
      const loc = `~${base}/${quizDocRef.id}`;
      setLocation(loc, { replace: true });
      return;
    }

    if (quizSnap?.current?.ref) {
      updateQuiz(quizSnap.current.ref, quizData);
    }
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
      <h1>
        {!quizID
          ? "Create Quiz"
          : `Editing Quiz: ${quizData?.title ? quizData.title : quizID}`}
      </h1>
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
