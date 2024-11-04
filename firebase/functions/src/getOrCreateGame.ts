import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { generatePIN } from "./utils/generatePIN";

import { GameStatus, LiveGame, SavedGame } from "../../../shared/game.types";
import type { Quiz } from "../../../shared/quiz.types";
import { splitQuestionsAndAnswerKey } from "./utils/buildAnswerKey";
import { getActiveGameByQuizID } from "./utils/getActiveGame";

const db = admin.firestore();

export const getOrCreateGame = onCall<string, Promise<LiveGame>>(
  async (request) => {
    const quizID = request.data;
    const userID = request.auth?.uid;

    if (!userID) {
      throw new HttpsError("permission-denied", "User not logged in");
    }

    const activeGame = await getActiveGameByQuizID(userID, quizID);
    if (activeGame) return activeGame;

    const quizDoc = await db.collection("quizzes").doc(quizID).get();
    if (!quizDoc.exists) {
      throw new HttpsError("not-found", `Quiz with ID ${quizID} not found.`);
    }
    const quizData = quizDoc.data() as Quiz;

    if (quizData.teacherID !== userID) {
      throw new HttpsError(
        "permission-denied",
        `User ${userID} tried to access Quiz ${quizID}.`
      );
    }

    const { questions, answerKey } = splitQuestionsAndAnswerKey(
      quizData.questions
    );
    const quiz: SavedGame["quiz"] = {
      description: quizData.description,
      title: quizData.title,
      questions,
    };

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

    const newGame: SavedGame = {
      id: db.collection("dummy").doc().id,
      teacherID: userID,
      quizID,
      pin,
      status: GameStatus.PENDING,
      quiz,
      answerKey,
    };
    const liveGame: LiveGame = {
      ...newGame,
      players: [],
      activeGameChannel: {
        status: GameStatus.PENDING,
        currentQuestionIndex: 0,
      },
    };

    const newGameRef = db.collection("games").doc(newGame.id);
    const activeGameChannelRef = db
      .collection("activeGamesChannel")
      .doc(newGame.id);

    const batch = db.batch();
    batch.set(newGameRef, newGame);
    batch.set(activeGameChannelRef, liveGame.activeGameChannel);
    await batch.commit();

    return liveGame;
  }
);
