import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { generatePIN } from "./utils/generatePIN";

import type { Quiz } from "../../../src/services/quiz";

const db = admin.firestore();

type StoredGame = {
  pin: string;
  quizID: string;
  currentQuestionIndex: number;
  teacherID: string;
};

export type ReturnedGame = StoredGame & {
  id: string;
  quizData: Quiz;
};

export const createGame = onCall<string, Promise<ReturnedGame>>(
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

    const gameSnap = await db
      .collection("activeGames")
      .where("quizID", "==", quizID)
      .get();

    if (!gameSnap.empty) {
      const gameDoc = gameSnap.docs[0];
      const game: ReturnedGame = gameDoc.data() as StoredGame;
      game.id = gameDoc.id;
      game.quizData = quizData;
      return game;
    }

    let pin: string;
    let pinExists = true;
    while (pinExists) {
      pin = generatePIN();

      const pinQuery = await db
        .collection("activeGames")
        .where("pin", "==", pin)
        .get();

      pinExists = !pinQuery.empty;
    }

    const newGame = {
      pin,
      quizID,
      teacherID: quizData.teacherID,
      currentQuestionIndex: 0,
    };

    const newGameRef = await db.collection("activeGames").add(newGame);

    return {
      id: newGameRef.id,
      ...newGame,
      quizData,
    };
  },
);
