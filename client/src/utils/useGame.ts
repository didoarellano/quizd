import { useQuery } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import type { ReturnedGame } from "../../../shared/game.types";
import { functions } from "../services/firebase";

const getOrCreateGame = httpsCallable<string, ReturnedGame>(
  functions,
  "getOrCreateGame",
);

export function useGame(quizID: string) {
  return useQuery({
    queryKey: ["games", quizID],
    queryFn: () => getOrCreateGame(quizID).then(({ data }) => data),
  });
  return { game: data?.data, ...rest };
}
