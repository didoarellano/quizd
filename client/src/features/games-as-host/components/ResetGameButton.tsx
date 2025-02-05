import { resetGame } from "@/services/game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

export function ResetGameButton({ quizID }: { quizID: string }) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const resetGameMutation = useMutation({
    mutationFn: () => resetGame(quizID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games", quizID] });
      setLocation(`~/host/${quizID}/play`);
    },
  });
  return <button onClick={() => resetGameMutation.mutate()}>RESET GAME</button>;
}
