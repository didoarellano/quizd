import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect } from "react";
import type {
  JoinGameResponse,
  ReturnedGame,
} from "../../../shared/game.types";
import { signinAnonymously } from "../services/auth";
import { auth, db, functions } from "../services/firebase";

const getOrCreateGame = httpsCallable<string, ReturnedGame>(
  functions,
  "getOrCreateGame",
);

export function useGameAsHost(quizID: string) {
  const queryRes = useQuery({
    queryKey: ["games", quizID],
    queryFn: () => getOrCreateGame(quizID).then(({ data }) => data),
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const gameID = queryRes?.data?.id;
    if (!gameID) return;
    const gameRef = doc(db, "games", gameID);
    const unsubscribe = onSnapshot(gameRef, async (snapshot) => {
      const gameData = snapshot.data();
      if (gameData) {
        queryClient.setQueryData(["games", quizID], {
          ...queryRes.data,
          ...gameData,
        });
      }
    });
    return unsubscribe;
  }, [queryClient, quizID, queryRes]);

  return queryRes;
}

const joinGame = httpsCallable<string, JoinGameResponse>(functions, "joinGame");

export function useGameAsPlayer(pin: string) {
  const queryRes = useQuery({
    queryKey: ["games", pin],
    queryFn: async () => {
      const { data } = await joinGame(pin);
      if (data.displayName) {
        const user = auth.currentUser as User;
        await updateProfile(user, {
          displayName: data.displayName,
        });
        user.reload();
      }
      return data;
    },
    enabled: !!auth.currentUser && !!pin,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!auth.currentUser) signinAnonymously();
  }, []);

  useEffect(() => {
    const gameID = queryRes?.data?.game.id;
    if (!gameID) return;
    const gameRef = doc(db, "games", gameID);
    const unsubscribe = onSnapshot(gameRef, async (snapshot) => {
      const gameData = snapshot.data();
      if (gameData) {
        gameData.id = gameID;
        queryClient.setQueryData(["games", pin], {
          ...queryRes.data,
          game: gameData,
        });
      }
    });
    return unsubscribe;
  }, [pin, queryClient, queryRes]);

  return queryRes;
}
