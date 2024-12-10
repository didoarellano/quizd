import * as admin from "firebase-admin";
import { HttpsError } from "firebase-functions/https";
import {
  ActiveGameChannel,
  GameStatus,
  LiveGame,
  Player,
  SavedGame,
} from "../types/game";

const db = admin.firestore();

export async function getActiveGameByQuizID(
  userID: string,
  quizID: string
): Promise<LiveGame | null> {
  const gameSnapshot = await db
    .collection("games")
    .where("hostID", "==", userID)
    .where("quizID", "==", quizID)
    .where("status", "!=", GameStatus.COMPLETED)
    .get();

  if (gameSnapshot.empty) return null;

  const gameDoc = gameSnapshot.docs[0];
  const game = gameDoc.data() as SavedGame;

  const playersSnapshot = await gameDoc.ref.collection("players").get();
  const players: Player[] = !playersSnapshot.empty
    ? playersSnapshot.docs.map((playerDoc) => playerDoc.data() as Player)
    : [];

  const activeGameChannelDoc = await db
    .collection("activeGamesChannel")
    .doc(game.id)
    .get();
  const activeGameChannel = activeGameChannelDoc.data();
  if (!activeGameChannelDoc.exists || !activeGameChannel) {
    throw new HttpsError(
      "internal",
      `activeGameChannel for game ${game.id} missing.`
    );
  }

  return {
    ...game,
    players,
    activeGameChannel: activeGameChannel as ActiveGameChannel,
  };
}

export async function getActiveGameByPIN(
  pin: string
): Promise<SavedGame | null> {
  const gameSnapshot = await db
    .collection("games")
    .where("pin", "==", pin)
    .where("status", "!=", GameStatus.COMPLETED)
    .get();
  const game = gameSnapshot.docs[0].data();
  if (gameSnapshot.empty || !game) return null;
  return game as SavedGame;
}
