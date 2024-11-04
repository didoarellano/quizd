import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { updateProfile, User } from "firebase/auth";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect } from "react";
import { JoinGameResponse, LiveGame, Player } from "../../../shared/game.types";
import { signinAnonymously } from "../services/auth";
import { auth, db, functions } from "../services/firebase";

const getOrCreateGame = httpsCallable<string, LiveGame>(
  functions,
  "getOrCreateGame"
);

export function useGameAsHost(quizID: string) {
  const queryRes = useQuery({
    queryKey: ["games", quizID],
    queryFn: () => getOrCreateGame(quizID).then(({ data }) => data),
  });

  const queryClient = useQueryClient();
  const gameID = queryRes?.data?.id;
  useEffect(() => {
    if (!gameID) return;
    const playersCollection = collection(db, "games", gameID, "players");
    return onSnapshot(playersCollection, async (snapshot) => {
      const players: Player[] = snapshot.docs.map(
        (doc) => doc.data() as Player
      );
      queryClient.setQueryData(["games", quizID], {
        ...queryRes.data,
        players,
      });
    });
  }, [gameID, quizID, queryRes, queryClient]);

  return queryRes;
}

const joinGame = httpsCallable<string, JoinGameResponse>(functions, "joinGame");

export function useGameAsPlayer(pin: string): UseQueryResult<JoinGameResponse> {
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

  useEffect(() => {
    if (!auth.currentUser) signinAnonymously();
  }, []);

  const queryClient = useQueryClient();
  useEffect(() => {
    const gameID = queryRes?.data?.gameID;
    if (!gameID) return;
    const activeGameChannelRef = doc(db, "activeGamesChannel", gameID);
    return onSnapshot(activeGameChannelRef, async (snapshot) => {
      const channelData = snapshot.data();
      if (!channelData) return;
      queryClient.setQueryData(["games", pin], {
        ...queryRes.data,
        activeGameChannel: channelData,
      });
    });
  }, [pin, queryRes, queryClient]);

  return queryRes;
}
