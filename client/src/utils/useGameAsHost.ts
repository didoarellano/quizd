import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { useEffect } from "react";
import { LiveGame, Player } from "../../../shared/game.types";
import { db, functions } from "../services/firebase";

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
