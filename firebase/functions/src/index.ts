/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";

admin.initializeApp();
const db = admin.firestore();

import { customAlphabet } from "nanoid";

const generatePIN = customAlphabet("0123456789", 6);

export const createGame = onCall(async (request) => {
  const quizID = request.data;

  const quizDoc = await db.collection("quizzes").doc(quizID).get();

  if (!quizDoc.exists) {
    logger.error(`Quiz with ID ${quizID} not found.`);
    throw new HttpsError("not-found", `Quiz with ID ${quizID} does not exist.`);
  }

  const quizData = quizDoc.data();

  let activeGameSnap = await db
    .collection("activeGames")
    .where("quizID", "==", quizID)
    .get();

  let activeGame;

  if (!activeGameSnap.empty) {
    const activeGameDoc = activeGameSnap.docs[0];
    activeGame = activeGameDoc.data();
    activeGame.id = activeGameDoc.id;
    activeGame.quizData = quizData;
    return activeGame;
  }

  let pin;
  let pinExists = true;
  while (pinExists) {
    pin = generatePIN();

    const pinQuery = await db
      .collection("activeGames")
      .where("pin", "==", pin)
      .get();

    pinExists = !pinQuery.empty;
  }

  activeGame = {
    pin,
    quizID,
    teacherID: quizData.teacherID,
    currentQuestionIndex: 0,
  };

  db.collection("activeGames").add(activeGame);

  return {
    ...activeGame,
    quizData,
  };
});
