import { UserRecord } from "firebase-admin/auth";
import { CollectionReference } from "firebase-admin/firestore";
import { Player } from "../../../../src/types/game";
import { generateUniqueUsername } from "./generateUsername";

export async function addPlayerToGame(
  user: UserRecord,
  playersCollection: CollectionReference,
  playerNames: string[]
): Promise<Player> {
  const userID = user.uid;
  const displayName = user.displayName || generateUniqueUsername(playerNames);
  const player: Player = {
    id: userID,
    displayName,
    answers: {},
  };
  await playersCollection.doc(userID).set(player);
  return player;
}
