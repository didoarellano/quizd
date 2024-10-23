import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import type { StoredGame } from "../../../shared/game.types";
import { generateUsername } from "./utils/generateUsername";

const db = admin.firestore();

export const joinGame = onCall<
  string,
  Promise<{ displayName: string; gameID: string }>
>(async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    logger.error("User is not logged in");
    throw new HttpsError("permission-denied", "User is not logged in");
  }

  const pin = request.data;
  const gameSnapshot = await db
    .collection("games")
    .where("pin", "==", pin)
    .get();

  if (gameSnapshot.empty) {
    logger.error(`No game with PIN ${pin}`);
    throw new HttpsError("not-found", `Game with PIN ${pin} does not exist.`);
  }

  const gameDoc = gameSnapshot.docs[0];
  const game = gameDoc.data() as StoredGame;

  let displayName = "";
  do {
    displayName = generateUsername();
  } while (game.players.includes(displayName));

  return {
    displayName,
    gameID: gameDoc.id,
  };
});
