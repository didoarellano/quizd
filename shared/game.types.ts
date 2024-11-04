import type { Question, Quiz } from "./quiz.types";

export const GameStatus = {
  PENDING: "pending",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;

type GameStatusKeys = (typeof GameStatus)[keyof typeof GameStatus];

export type Player = {
  id: string;
  displayName: string;
  answers: { [questionID: string]: string };
};

export type SavedGame = {
  id: string;
  teacherID: string;
  quizID: string;
  pin: string;
  status: GameStatusKeys;
  quiz: Omit<Quiz, "id" | "_rawMD" | "teacherID" | "createdAt"> & {
    questions: Omit<Question, "answers">[];
  };
  answerKey: {
    [questionID: string]: string[];
  };
};

export type ActiveGameChannel = {
  status: GameStatusKeys;
  currentQuestionIndex: number;
  currentQuestionTimer?: number;
  currentQuestionAnswer?: string[];
};

export type LiveGame = SavedGame & {
  players: Player[];
  activeGameChannel: ActiveGameChannel;
};

export type JoinGameResponse = {
  displayName?: string;
  game: SavedGame;
  quiz: Omit<Quiz, "id" | "_rawMD" | "teacherID" | "createdAt"> & {
    questions: Omit<Question, "answers">[];
  };
};
