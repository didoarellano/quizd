import { useQuery } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import type { ReturnedGame } from "../../../shared/game.types";
import { functions } from "../services/firebase";

const getOrCreateGame = httpsCallable<string, ReturnedGame>(
  functions,
  "getOrCreateGame",
);

export function useGame(quizID: string) {
  const { data, ...rest } = useQuery({
    queryKey: ["games", quizID],
    queryFn: () => getOrCreateGame(quizID),
  });
  return { game: data?.data, ...rest };
}
