import * as admin from "firebase-admin";
import { ActiveGameChannel } from "../../../../src/types/game";

const db = admin.firestore();

export async function getActiveGameChannel(
  gameID: string
): Promise<ActiveGameChannel | null> {
  const activeGameChannelDoc = await db
    .collection("activeGamesChannel")
    .doc(gameID)
    .get();
  const activeGameChannel = activeGameChannelDoc.data();
  if (!activeGameChannelDoc.exists || !activeGameChannel) return null;
  return activeGameChannel as ActiveGameChannel;
}
