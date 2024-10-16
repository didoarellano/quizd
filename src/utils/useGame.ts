import { useQuery } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import type { ReturnedGame } from "../../firebase/functions/src/createGame";
import { functions } from "../services/firebase";

const createGame = httpsCallable<string, ReturnedGame>(functions, "createGame");

export function useGame(quizID: string) {
  const { data, ...rest } = useQuery({
    queryKey: ["games", quizID],
    queryFn: () => createGame(quizID),
  });
  return { game: data?.data, ...rest };
}
