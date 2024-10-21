import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { NotAllowedError, QuizNotFoundError } from "../utils/errors";
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
  createdAt: FieldValue;
};

export async function getQuiz(
  quizID: string,
  teacherID: string,
): Promise<{ docSnap: DocumentSnapshot<Quiz>; quizData: Quiz }> {
  const docRef = doc(db, "quizzes", quizID) as DocumentReference<Quiz>;
  const docSnap = await getDoc(docRef);
  const quizData = docSnap?.data();

  if (!docSnap.exists()) throw new QuizNotFoundError();
  if (quizData?.teacherID !== teacherID) throw new NotAllowedError();

  return { docSnap, quizData: quizData as Quiz };
}

export async function getQuizzes(
  teacherID: string,
  sort: "asc" | "desc" = "desc",
): Promise<Quiz[]> {
  const q = query(
    collection(db, "quizzes"),
    orderBy("createdAt", sort),
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
  quizData: Partial<Quiz>,
): Promise<DocumentReference<Quiz>> {
  quizData.teacherID = teacher.id;
  quizData.createdAt = serverTimestamp();
  const quizzesCollection = collection(
    db,
    "quizzes",
  ) as CollectionReference<Quiz>;
  return addDoc(quizzesCollection, quizData as Quiz);
}

export function updateQuiz(
  quizRef: DocumentReference,
  quizData: Partial<Quiz>,
): Promise<void> {
  return updateDoc(quizRef, quizData);
}

export function deleteQuizByID(quizID: string): Promise<void> {
  const quizRef = doc(db, "quizzes", quizID);
  return deleteDoc(quizRef);
}

export function generateID(): string {
  return doc(collection(db, "dummy")).id;
}
