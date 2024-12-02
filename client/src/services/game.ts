import { db, functions } from "@/services/firebase";
import {
  EndGameResponse,
  GameStatus,
  JoinGameResponse,
  LiveGame,
} from "@/types/game";
import { doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export const getOrCreateGame = httpsCallable<string, LiveGame>(
  functions,
  "getOrCreateGame"
);
export const endGame = httpsCallable<string, EndGameResponse>(
  functions,
  "endGame"
);
export const joinGame = httpsCallable<string, JoinGameResponse>(
  functions,
  "joinGame"
);
export const resetGame = httpsCallable<string, void>(functions, "resetGame");

export function startGame(gameID: string) {
  const gameRef = doc(db, "games", gameID);
  const activeGameChannelRef = doc(db, "activeGamesChannel", gameID);
  return Promise.all([
    updateDoc(gameRef, { status: GameStatus.ONGOING }),
    updateDoc(activeGameChannelRef, {
      status: GameStatus.ONGOING,
    }),
  ]);
}

export function startNewQuestion(gameID: string, currentQuestionIndex: number) {
  const activeGameChannelRef = doc(db, "activeGamesChannel", gameID);
  return updateDoc(activeGameChannelRef, {
    currentQuestionIndex,
    currentQuestionAnswer: null,
  });
}

export function closeQuestion(gameID: string, currentQuestionAnswer: string[]) {
  const activeGameChannelRef = doc(db, "activeGamesChannel", gameID);
  return updateDoc(activeGameChannelRef, { currentQuestionAnswer });
}
