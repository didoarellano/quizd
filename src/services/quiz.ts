import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Teacher } from "./auth";

export type Option = {
  id: string;
  text: string;
};

export const QuestionTypes = {
  Multi: "multiple-choice",
  Text: "text",
} as const;

type QuestionTypeKeys = (typeof QuestionTypes)[keyof typeof QuestionTypes];

export type Question = {
  id: string;
  type: QuestionTypeKeys;
  heading: string;
  body: string;
  options: Option[];
  answers: Option["id"][];
};

export type Quiz = {
  id?: string;
  teacherID: Teacher["id"];
  title: string;
  description?: string;
  questions: Question[];
};

export function getQuiz(quizID: string): Promise<DocumentSnapshot> {
  const docRef = doc(db, "quizzes", quizID);
  return getDoc(docRef);
}

export function saveNewQuiz(
  teacher: Teacher,
  quizData: Partial<Quiz>
): Promise<DocumentReference> {
  quizData.teacherID = teacher.id;
  return addDoc(collection(db, "quizzes"), quizData);
}

export function updateQuiz(
  quizRef: DocumentReference,
  quizData: Partial<Quiz>
): Promise<void> {
  return updateDoc(quizRef, quizData);
}

export function deleteQuiz(quizRef: DocumentReference): Promise<void> {
  return deleteDoc(quizRef);
}
