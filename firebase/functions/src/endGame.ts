import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import {
  ActiveGameChannel,
  EndGameResponse,
  GameStatus,
  Player,
  SavedGame,
} from "../../../src/types/game";

const db = admin.firestore();

export const endGame = onCall<string, Promise<EndGameResponse>>(
  async (request) => {
    const quizID = request.data;
    const userID = request.auth?.uid;

    if (!userID) {
      throw new HttpsError("permission-denied", "User not logged in");
    }

    const gameSnapshot = await db
      .collection("games")
      .where("teacherID", "==", userID)
      .where("quizID", "==", quizID)
      .get();

    if (gameSnapshot.empty) {
      throw new HttpsError("not-found", "Game not found.");
    }

    const gameDoc = gameSnapshot.docs[0];
    const game = gameDoc.data() as SavedGame;

    const playersCollection = db.collection(`games/${game.id}/players`);
    const playersSnapshot = await playersCollection.get();
    const leaderboard = playersSnapshot.docs
      .map((playerDoc) => {
        const { id, displayName, answers } = playerDoc.data() as Player;
        const score = Object.entries(answers).reduce(
          (sum, [questionID, answerID]) => {
            return (
              sum + (game.answerKey[questionID].includes(answerID) ? 1 : 0)
            );
          },
          0
        );

        return {
          id,
          displayName,
          score,
        };
      })
      .sort((p1, p2) => p2.score - p1.score);

    if (game.status !== GameStatus.COMPLETED) {
      const batch = db.batch();

      const status = GameStatus.COMPLETED;
      batch.update(gameDoc.ref, {
        status,
        completedOn: FieldValue.serverTimestamp(),
      } as SavedGame);

      const activeGameChannelRef = db
        .collection("activeGamesChannel")
        .doc(game.id);
      batch.update(activeGameChannelRef, {
        status,
        leaderboard,
      } as Partial<ActiveGameChannel>);

      await batch.commit();
    }

    return {
      leaderboard,
      quiz: {
        title: game.quiz.title,
        description: game.quiz.description,
      },
    };
  }
);
