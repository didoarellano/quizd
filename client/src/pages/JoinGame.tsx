import { updateProfile } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { FormEvent, useRef } from "react";
import { useLocation } from "wouter";
import { signinAnonymously } from "../services/auth";
import { auth, functions } from "../services/firebase";

const joinGame = httpsCallable<string, { displayName: string; gameID: string }>(
  functions,
  "joinGame",
);

export function JoinGame() {
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pin = inputRef?.current?.value;
    if (!pin) return;

    await signinAnonymously();
    if (!auth.currentUser) {
      // TODO Do something appropriate
      return;
    }

    const {
      data: { displayName, gameID },
    } = await joinGame(pin);
    await updateProfile(auth.currentUser, {
      displayName,
    });
    auth.currentUser?.reload();
    setLocation(`/${gameID}`);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="pin"
          ref={inputRef}
          type="text"
          minLength={6}
          maxLength={6}
          placeholder="Enter PIN code"
        />
        <button>Join Game</button>
      </form>
    </>
  );
}
