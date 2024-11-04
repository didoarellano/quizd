import * as admin from "firebase-admin";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { JoinGameResponse } from "../../../shared/game.types";
import { addPlayerToGame } from "./utils/addPlayerToGame";
import { getActiveGameByPIN } from "./utils/getActiveGame";
import { getActiveGameChannel } from "./utils/getActiveGameChannel";

const db = admin.firestore();

export const joinGame = onCall<string, Promise<JoinGameResponse>>(
  async (request) => {
    const userID = request.auth?.uid;
    if (!userID) {
      throw new HttpsError("permission-denied", "User is not logged in");
    }

    const pin = request.data;
    const game = await getActiveGameByPIN(pin);
    if (!game) {
      throw new HttpsError(
        "not-found",
        `No pending game with PIN ${pin} found`
      );
    }

    const activeGameChannel = await getActiveGameChannel(game.id);
    if (!activeGameChannel) {
      throw new HttpsError(
        "internal",
        `activeGameChannel for game ${game.id} missing.`
      );
    }

    const response: JoinGameResponse = {
      gameID: game.id,
      quiz: game.quiz,
      activeGameChannel,
    };

    const playersCollection = db.collection(`games/${game.id}/players`);
    const playersSnapshot = await playersCollection.get();
    const user = await admin.auth().getUser(userID);
    const playerNames: string[] = playersSnapshot.docs.map(
      (playerDoc) => playerDoc.data().displayName
    );

    const playerHasJoined = playerNames.includes(user.displayName || "");
    if (!playerHasJoined) {
      const { displayName } = await addPlayerToGame(
        user,
        playersCollection,
        playerNames
      );
      response.displayName = displayName;
    }

    return response;
  }
);
