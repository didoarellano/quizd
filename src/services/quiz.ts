import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import type { Teacher } from "./auth";
import { db } from "./firebase";

export type Option = {
  id: string;
  text: string;
};

export type Answer = Option["id"];

export const QuestionTypes = {
  Multi: "multiple-choice",
  Text: "text",
} as const;

type QuestionTypeKeys = (typeof QuestionTypes)[keyof typeof QuestionTypes];

export type Question = {
  id: string;
  type?: QuestionTypeKeys;
  heading: string;
  body: string;
  options: Option[];
  answers: Option["id"][];
};

export type Quiz = {
  id?: string;
  _rawMD: string;
  teacherID: Teacher["id"];
  title: string;
  description?: string;
  questions: Question[];
};

export function getQuiz(quizID: string): Promise<DocumentSnapshot> {
  const docRef = doc(db, "quizzes", quizID);
  return getDoc(docRef);

export async function getQuizzes(teacherID: string): Promise<Quiz[]> {
  const q = query(
    collection(db, "quizzes"),
    where("teacherID", "==", teacherID),
  );
  const querySnapshot = await getDocs(q);
  const quizzes: Quiz[] = querySnapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    } as Quiz;
  });

  return quizzes;
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

export function generateID(): string {
  return doc(collection(db, "dummy")).id;
}
