import { ActiveQuestion } from "@/features/games-as-player/components/ActiveQuestion";
import { GameResults } from "@/features/games-as-player/components/GameResults";
import { WaitingForHost } from "@/features/games-as-player/components/WaitingForHost";
import { useGameAsPlayer } from "@/features/games-as-player/queries";
import { GameStatus } from "@/types/game";
import { useAuth } from "@/utils/AuthContext";
import { Redirect, useRouter } from "wouter";

export function PlayerGameScreen({ pin }: { pin: string }) {
  const { user } = useAuth();
  const { data, isPending } = useGameAsPlayer(pin);
  const { base } = useRouter();

  if (isPending) {
    return <p>...</p>;
  }

  if (!data) {
    // TODO flash message
    return <Redirect to={`~${base}`} />;
  }

  if (!user) {
    return <Redirect to={`~${base}`} />;
  }

  if (data.activeGameChannel.status === GameStatus.PENDING) {
    return <WaitingForHost username={user.displayName} />;
  }

  if (data.activeGameChannel.status === GameStatus.ONGOING) {
    return <ActiveQuestion data={data} gamePIN={pin} />;
  }

  if (
    data.activeGameChannel.status === GameStatus.COMPLETED &&
    data.activeGameChannel.leaderboard
  ) {
    const thisPlayer = data.activeGameChannel.leaderboard.find(
      (player) => player.id === user.id
    );

    return (
      thisPlayer && (
        <GameResults
          player={thisPlayer}
          questionCount={data.quiz.questions.length}
        />
      )
    );
  }

  return <p>...</p>;
}
