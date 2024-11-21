import type { Question, Quiz } from "./quiz.types";

export const GameStatus = {
  PENDING: "pending",
  ONGOING: "ongoing",
  COMPLETED: "completed",
} as const;

export type GameStatusKeys = (typeof GameStatus)[keyof typeof GameStatus];

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
  completedOn?: any; // FieldValue is the correct type but we'll need to install firebase in this dir too
  quiz: Omit<Quiz, "id" | "_rawMD" | "teacherID" | "createdAt"> & {
    questions: Omit<Question, "answers">[];
  };
  answerKey: {
    [questionID: string]: string[];
  };
};

export type Leaderboard = { id: string; displayName: string; score: number }[];

export type ActiveGameChannel = {
  status: GameStatusKeys;
  currentQuestionIndex: number;
  currentQuestionTimer?: number;
  currentQuestionAnswer?: string[];
  leaderboard?: Leaderboard;
};

export type LiveGame = SavedGame & {
  players: Player[];
  activeGameChannel: ActiveGameChannel;
};

export type JoinGameResponse = {
  gameID: string;
  quiz: SavedGame["quiz"];
  displayName: string;
  isNewPlayer: boolean;
  activeGameChannel: ActiveGameChannel;
  answers: Player["answers"];
};

export type EndGameResponse = {
  leaderboard: Leaderboard;
  quiz: Pick<Quiz, "title" | "description">;
};
