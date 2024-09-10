import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { Unsubscribe, User } from "firebase/auth";

import { app, db } from "./firebase";

const provider = new GoogleAuthProvider();

export const auth = getAuth(app);

export async function isUserWhitelisted(email: string): Promise<boolean> {
  const docRef = doc(db, "teachers", email);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export async function signin(): Promise<User> {
  const { user } = await signInWithPopup(auth, provider);
  return user;
}

export async function signinAnonymously(): Promise<User> {
  const { user } = await signInAnonymously(auth);
  return user;
}

export function signout(): Promise<void> {
  return signOut(auth);
}

export function onAuthChange(cb: Function): Unsubscribe {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return cb(null);

    const isWhitelisted = !!user.email && (await isUserWhitelisted(user.email));
    if (isWhitelisted) {
      cb(user);
    } else {
      await signout();
      cb(null);
    }
  });
}
