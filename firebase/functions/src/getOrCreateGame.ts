import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { generatePIN } from "./utils/generatePIN";

import {
  GameStatus,
  type ReturnedGame,
  type StoredGame,
} from "../../../shared/game.types";
import type { Quiz } from "../../../shared/quiz.types";

const db = admin.firestore();

export const getOrCreateGame = onCall<string, Promise<ReturnedGame>>(
  async (request) => {
    const quizID = request.data;

    const quizDoc = await db.collection("quizzes").doc(quizID).get();

    if (!quizDoc.exists) {
      logger.error(`Quiz with ID ${quizID} not found.`);
      throw new HttpsError(
        "not-found",
        `Quiz with ID ${quizID} does not exist.`,
      );
    }

    const quizData = quizDoc.data() as Quiz;

    if (quizData.teacherID !== request.auth?.uid) {
      logger.error(`User ${request.auth?.uid} tried to access Quiz ${quizID}.`);
      throw new HttpsError("permission-denied", "Permission Denied");
    }

    const gameSnap = await db
      .collection("games")
      .where("quizID", "==", quizID)
      .get();

    if (!gameSnap.empty) {
      const gameDoc = gameSnap.docs[0];
      const gameData = gameDoc.data() as StoredGame;
      const game: ReturnedGame = {
        ...gameData,
        id: gameDoc.id,
        quizData: quizData,
      };
      return game;
    }

    let pin = "";
    let pinExists = true;
    while (pinExists) {
      pin = generatePIN();

      const pinQuery = await db
        .collection("games")
        .where("pin", "==", pin)
        .get();

      pinExists = !pinQuery.empty;
    }

    const newGame = {
      pin,
      quizID,
      status: GameStatus.PENDING,
      currentQuestionIndex: 0,
    };

    const newGameRef = await db.collection("games").add(newGame);

    return {
      id: newGameRef.id,
      ...newGame,
      quizData,
    };
  },
);
