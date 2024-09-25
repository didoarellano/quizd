/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
const db = admin.firestore();

export const ping = onCall(async () => {
  const counterRef = db.collection("hits").doc("hitCount");
  try {
    const counterDoc = await counterRef.get();
    let newCount;
    if (counterDoc.exists) {
      const currentCount = counterDoc.data()?.count || 0;
      newCount = currentCount + 1;
      await counterRef.update({ count: newCount });
    } else {
      await counterRef.set({ count: 1 });
      newCount = 1;
    }
    return {
      hits: newCount,
    };
  } catch (error) {
    logger.error("Error incrementing hit counter:", error);
    return {
      error,
    };
  }
});
