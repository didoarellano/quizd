import type { Quiz } from "./quiz.types";

export type StoredGame = {
  pin: string;
  quizID: string;
  currentQuestionIndex: number;
  teacherID: string;
};

export type ReturnedGame = StoredGame & {
  id: string;
  quizData: Quiz;
};
