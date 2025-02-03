import { db, functions } from "@/services/firebase";
import {
  EndGameResponse,
  GameStatus,
  JoinGameResponse,
  LiveGame,
} from "@/types/game";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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

export async function gameWithPinExists(pin: string) {
  const q = query(
    collection(db, "activeGamesChannel"),
    where("status", "!=", GameStatus.COMPLETED),
    where("pin", "==", pin)
  );
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}
