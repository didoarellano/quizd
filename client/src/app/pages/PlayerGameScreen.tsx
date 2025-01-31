import { ActiveQuestion } from "@/features/games-as-player/components/ActiveQuestion";
import { GameResults } from "@/features/games-as-player/components/GameResults";
import {
  GameRouter,
  Route,
} from "@/features/games-as-player/components/GameRouter";
import { LoadingGame } from "@/features/games-as-player/components/LoadingGame";
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
    return <LoadingGame />;
  }

  if (!data) {
    // TODO flash message
    return <Redirect to={`~${base}`} />;
  }

  if (!user) {
    return <Redirect to={`~${base}`} />;
  }

  return (
    <GameRouter status={data.activeGameChannel.status}>
      <Route
        status={GameStatus.PENDING}
        component={<WaitingForHost username={user.displayName} />}
      />
      <Route
        status={GameStatus.ONGOING}
        component={<ActiveQuestion data={data} gamePIN={pin} />}
      />
      <Route
        status={GameStatus.COMPLETED}
        component={
          <GameResults
            player={
              data?.activeGameChannel?.leaderboard?.find(
                (player) => player.id === user.id
              ) ?? null
            }
            questionCount={data.quiz.questions.length}
          />
        }
      />
    </GameRouter>
  );
}
