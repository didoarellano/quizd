import { db } from "@/services/firebase";
import { Quiz as _Quiz } from "@/types/quiz";
import { NotAllowedError, QuizNotFoundError } from "@/utils/errors";
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

type Quiz = _Quiz & {
  createdAt: FieldValue;
};

export async function getQuiz(
  quizID: string,
  teacherID: string
): Promise<{ docSnap: DocumentSnapshot<Quiz>; quiz: Quiz }> {
  const docRef = doc(db, "quizzes", quizID) as DocumentReference<Quiz>;
  const docSnap = await getDoc(docRef);
  const quiz = docSnap?.data();

  if (!docSnap.exists()) throw new QuizNotFoundError();
  if (quiz?.teacherID !== teacherID) throw new NotAllowedError();

  return { docSnap, quiz: quiz as Quiz };
}

export async function getQuizzes(
  teacherID: string,
  sort: "asc" | "desc" = "desc"
): Promise<Quiz[]> {
  const q = query(
    collection(db, "quizzes"),
    orderBy("createdAt", sort),
    where("teacherID", "==", teacherID)
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
  teacherID: string,
  quiz: Partial<Quiz>
): Promise<DocumentReference<Quiz>> {
  quiz.teacherID = teacherID;
  quiz.createdAt = serverTimestamp();
  const quizzesCollection = collection(
    db,
    "quizzes"
  ) as CollectionReference<Quiz>;
  return addDoc(quizzesCollection, quiz as Quiz);
}

export function updateQuiz(
  quizRef: DocumentReference,
  quiz: Partial<Quiz>
): Promise<void> {
  return updateDoc(quizRef, quiz);
}

export function deleteQuizByID(quizID: string): Promise<void> {
  const quizRef = doc(db, "quizzes", quizID);
  return deleteDoc(quizRef);
}

export function generateID(): string {
  return doc(collection(db, "dummy")).id;
}
