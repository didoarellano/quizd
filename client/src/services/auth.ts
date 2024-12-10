import { auth, db } from "@/services/firebase";
import type { User as FirebaseUser, Unsubscribe } from "firebase/auth";
import {
  GoogleAuthProvider,
  onIdTokenChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export async function isUserWhitelisted(email: string): Promise<boolean> {
  const docRef = doc(db, "whitelist", email);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export const UserRoles = {
  Host: "host",
  Player: "player",
} as const;

type UserRoleKeys = (typeof UserRoles)[keyof typeof UserRoles];

export type Host = {
  id: string;
  displayName: string;
  email: string | null;
  role: typeof UserRoles.Host;
};

export type Player = {
  id: string;
  displayName: string;
  role: typeof UserRoles.Player;
};

export type User = Host | Player;

export async function assignRole(
  userId: string,
  role: UserRoleKeys
): Promise<void> {
  const hostsDocRef = doc(db, "hosts", userId);
  const userDoc = await getDoc(hostsDocRef);
  if (!userDoc.exists()) {
    await setDoc(hostsDocRef, { role });
  }
}

export async function signin(): Promise<FirebaseUser> {
  const { user } = await signInWithPopup(auth, provider);
  return user;
}

export async function signinAnonymously(): Promise<FirebaseUser> {
  const { user } = await signInAnonymously(auth);
  return user;
}

export function signout(): Promise<void> {
  return signOut(auth);
}

export function onAuthChange(cb: Function): Unsubscribe {
  return onIdTokenChanged(auth, async (user) => {
    if (!user) return cb(null);

    if (user.isAnonymous) {
      return cb({
        id: user.uid,
        displayName: user?.displayName ?? "",
        role: UserRoles.Player,
      });
    }

    const hostsDocRef = doc(db, "hosts", user.uid);
    const hostsDocSnap = await getDoc(hostsDocRef);

    if (hostsDocSnap.exists()) {
      const d = hostsDocSnap.data();
      return cb({
        id: d.id,
        email: d.email,
        displayName: d.displayName,
        role: UserRoles.Host,
      });
    }

    // New google signin, check if whitelisted
    const isWhitelisted = user.email && (await isUserWhitelisted(user.email));

    if (!isWhitelisted) {
      throw new Error("User is not in the whitelist");
    }

    // User is whitelisted but not yet in hosts collection
    await setDoc(hostsDocRef, {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
    });

    return cb({
      id: user.uid,
      email: user.email,
      // TODO: Create username generator
      displayName: user?.displayName ?? "Tonto",
      role: UserRoles.Host,
    });
  });
}
