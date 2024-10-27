import type { Question, Quiz } from "./quiz.types";

export const GameStatus = {
  PENDING: "pending",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;

type GameStatusKeys = (typeof GameStatus)[keyof typeof GameStatus];

export type StoredGame = {
  pin: string;
  status: GameStatusKeys;
  quizID: string;
  currentQuestionIndex: number;
  players: string[];
};

export type ReturnedGame = StoredGame & {
  id: string;
  quiz: Quiz;
};

export type JoinGameResponse = {
  displayName?: string;
  game: StoredGame & { id: string };
  quiz: Omit<Quiz, "id" | "_rawMD" | "teacherID" | "createdAt"> & {
    questions: Omit<Question, "answers">[];
  };
};
