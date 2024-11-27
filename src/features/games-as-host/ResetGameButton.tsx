import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpsCallable } from "firebase/functions";
import { useLocation } from "wouter";
import { functions } from "../../services/firebase";

const resetGame = httpsCallable(functions, "resetGame");

export function ResetGameButton({ quizID }: { quizID: string }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const resetGameMutation = useMutation({
    mutationFn: () => {
      return resetGame(quizID);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games", quizID] });
      setLocation(`${import.meta.env.VITE_BASE_URL}/host/${quizID}/play`);
    },
  });
  return <button onClick={() => resetGameMutation.mutate()}>RESET GAME</button>;
}
