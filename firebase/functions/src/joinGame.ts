import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
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

  const quizDoc = await db.collection("quizzes").doc(game.quizID).get();
  const quiz = quizDoc?.data();
  if (!quizDoc.exists || !quiz) {
    logger.error(`Error retrieving quiz ${game.quizID} data.`);
    throw new HttpsError(
      "internal",
      `Error retrieving quiz ${game.quizID} data.`,
    );
  }

  let displayName = "";
  do {
    displayName = generateUsername();
  } while (game.players.includes(displayName));

  await gameDoc.ref.update({
    players: FieldValue.arrayUnion(displayName),
  });

  return {
    displayName,
    game: {
      id: gameDoc.id,
      ...game,
    },
    quiz,
  };
});
