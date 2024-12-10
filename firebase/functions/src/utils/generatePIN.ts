import { firestore } from "firebase-admin";
import { customAlphabet } from "nanoid";
import { GameStatus } from "../types/game";

export const generatePIN = customAlphabet("0123456789", 6);

export async function generateUniquePin(db: firestore.Firestore) {
  const activeGamesSnapshot = await db
    .collection("games")
    .where("status", "!=", GameStatus.COMPLETED)
    .get();
  const activePins: string[] = activeGamesSnapshot.docs.map(
    (game) => game.data().pin
  );

  let pin = "";
  do {
    pin = generatePIN();
  } while (activePins.includes(pin));

  return pin;
}
