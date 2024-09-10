import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Unsubscribe, User as FirebaseUser } from "firebase/auth";

import { app, db } from "./firebase";

const provider = new GoogleAuthProvider();

export const auth = getAuth(app);

export async function isUserWhitelisted(email: string): Promise<boolean> {
  const docRef = doc(db, "whitelist", email);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
}

export const UserRoles = {
  Teacher: "teacher",
  Student: "student",
} as const;

type UserRoleKeys = (typeof UserRoles)[keyof typeof UserRoles];

export type Teacher = {
  id: string;
  displayName: string;
  email: string | null;
  role: typeof UserRoles.Teacher;
};

export type Student = {
  id: string;
  displayName: string;
  role: typeof UserRoles.Student;
};

export type User = Teacher | Student;

export async function assignRole(
  userId: string,
  role: UserRoleKeys
): Promise<void> {
  const teachersDocRef = doc(db, "teachers", userId);
  const userDoc = await getDoc(teachersDocRef);
  if (!userDoc.exists()) {
    await setDoc(teachersDocRef, { role });
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
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return cb(null);

    if (user.isAnonymous) {
      return cb({
        id: user.uid,
        // TODO: Create username generator
        displayName: user?.displayName ?? "Tonto",
        role: UserRoles.Student,
      });
    }

    const teachersDocRef = doc(db, "teachers", user.uid);
    const teachersDocSnap = await getDoc(teachersDocRef);

    if (teachersDocSnap.exists()) {
      const d = teachersDocSnap.data();
      return cb({
        id: d.id,
        email: d.email,
        displayName: d.displayName,
        role: UserRoles.Teacher,
      });
    }

    // New google signin, check if whitelisted
    const isWhitelisted = user.email && (await isUserWhitelisted(user.email));

    if (!isWhitelisted) {
      throw new Error("User is not in the whitelist");
    }

    // User is whitelisted but not yet in teachers collection
    await setDoc(teachersDocRef, {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
    });

    return cb({
      id: user.uid,
      email: user.email,
      // TODO: Create username generator
      displayName: user?.displayName ?? "Tonto",
      role: UserRoles.Teacher,
    });
  });
}
