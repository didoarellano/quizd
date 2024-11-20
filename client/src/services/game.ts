import { httpsCallable } from "firebase/functions";
import {
  EndGameResponse,
  JoinGameResponse,
  LiveGame,
} from "../../../shared/game.types";
import { functions } from "./firebase";

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
