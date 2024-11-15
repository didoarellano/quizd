import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { GameStatus, Leaderboard, Player } from "../../../shared/game.types";
import { getActiveGameByQuizID } from "./utils/getActiveGame";

const db = admin.firestore();

export const endGame = onCall<string, Promise<Leaderboard>>(async (request) => {
  const quizID = request.data;
  const userID = request.auth?.uid;

  if (!userID) {
    throw new HttpsError("permission-denied", "User not logged in");
  }

  const game = await getActiveGameByQuizID(userID, quizID);
  if (!game) {
    throw new HttpsError("not-found", "Game not found.");
  }

  if (game.teacherID !== userID) {
    throw new HttpsError(
      "permission-denied",
      `User ${userID} is not creator of game ${game.id}`
    );
  }

  const playersCollection = db.collection(`games/${game.id}/players`);
  const playersSnapshot = await playersCollection.get();
  const leaderboard = playersSnapshot.docs
    .map((playerDoc) => {
      const { id, displayName, answers } = playerDoc.data() as Player;
      const score = Object.entries(answers).reduce(
        (sum, [questionID, answerID]) => {
          return sum + (game.answerKey[questionID].includes(answerID) ? 1 : 0);
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

  // TODO
  // - Update game status and completedOn fields

  if (game.status !== GameStatus.COMPLETED) {
    await db
      .collection("activeGamesChannel")
      .doc(game.id)
      .update({ status: GameStatus.COMPLETED, leaderboard });
  }

  return leaderboard;
});
