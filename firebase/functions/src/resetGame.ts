import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { onCall } from "firebase-functions/v2/https";
import { GameStatus } from "./types/game";

const db = admin.firestore();

export const resetGame = onCall(async (request) => {
  const quizID = request.data;
  const batch = db.batch();

  const status = GameStatus.ONGOING;

  const gameSnapshot = await db
    .collection("games")
    .where("quizID", "==", quizID)
    .get();
  const gameDoc = gameSnapshot.docs[0];
  batch.update(gameDoc.ref, {
    status,
    completedOn: FieldValue.delete(),
  });

  const activeGameChannelRef = db
    .collection("activeGamesChannel")
    .doc(gameDoc.id);
  batch.update(activeGameChannelRef, {
    status,
    currentQuestionIndex: 0,
    currentQuestionAnswer: FieldValue.delete(),
    leaderboard: FieldValue.delete(),
  });

  const playersCollection = db.collection(`games/${gameDoc.id}/players`);
  const playersSnapshot = await playersCollection.get();
  playersSnapshot.forEach((playerDoc) => {
    batch.update(playerDoc.ref, {
      answers: {},
    });
  });

  batch.commit();
});
