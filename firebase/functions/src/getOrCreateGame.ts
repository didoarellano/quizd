import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { generateUniquePin } from "./utils/generatePIN";

import { GameStatus, LiveGame, SavedGame } from "./types/game";
import { Quiz } from "./types/quiz";
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

    if (quizData.hostID !== userID) {
      throw new HttpsError(
        "permission-denied",
        `User ${userID} tried to access Quiz ${quizID}.`
      );
    }

    const { questions, answerKey } = splitQuestionsAndAnswerKey(
      quizData.questions
    );
    const quiz: SavedGame["quiz"] = {
      title: quizData.title,
      description: quizData.description,
      questions,
    };

    const pin = await generateUniquePin(db);

    const newGame: SavedGame = {
      id: db.collection("dummy").doc().id,
      hostID: userID,
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
        pin,
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
