import type { Quiz } from "./quiz.types";

export type StoredGame = {
  pin: string;
  quizID: string;
  currentQuestionIndex: number;
};

export type ReturnedGame = StoredGame & {
  id: string;
  quizData: Quiz;
};
