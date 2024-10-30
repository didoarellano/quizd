import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import type { JoinGameResponse, StoredGame } from "../../../shared/game.types";
import { Quiz } from "../../../shared/quiz.types";
import { generateUniqueUsername } from "./utils/generateUsername";

const db = admin.firestore();

export const joinGame = onCall<string, Promise<JoinGameResponse>>(
  async (request) => {
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

    const quizQuery = db
      .collection("quizzes")
      .where("__name__", "==", game.quizID)
      .select("title", "description", "questions");
    const quizSnapshot = await quizQuery.get();

    if (quizSnapshot.empty) {
      logger.error(`Quiz with ID ${game.quizID} not found.`);
      throw new HttpsError(
        "not-found",
        `Quiz with ID ${game.quizID} does not exist.`,
      );
    }

    const quiz = quizSnapshot.docs[0].data() as Pick<
      Quiz,
      "title" | "description" | "questions"
    >;

    if (!quiz) {
      logger.error(`Error retrieving quiz ${game.quizID} data.`);
      throw new HttpsError(
        "internal",
        `Error retrieving quiz ${game.quizID} data.`,
      );
    }

    quiz.questions.forEach((q) => delete q.answers);

    const user = await admin.auth().getUser(uid);
    let displayName = user?.displayName;

    if (!displayName) {
      displayName = generateUniqueUsername(game.players);
    }

    if (!game.players.includes(displayName)) {
      await gameDoc.ref.update({
        players: FieldValue.arrayUnion(displayName),
      });
    }

    const response: JoinGameResponse = {
      game: {
        id: gameDoc.id,
        ...game,
      },
      quiz,
    };

    if (!user?.displayName) {
      response.displayName = displayName;
    }

    return response;
  },
);
