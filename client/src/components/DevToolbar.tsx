import { ResetGameButton } from "@/features/games-as-host/components/ResetGameButton";
import {
  useEndGame,
  useGameAsHost,
  useQuestionRoundMutations,
} from "@/features/games-as-host/queries";
import { UserRoles } from "@/services/auth";
import { useAuth } from "@/utils/AuthContext";
import { Bug } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export function DevToolbar() {
  const { user, signin, signout, signinAnonymously } = useAuth();
  const [location, setLocation] = useLocation();
  const hostRouteMatch = location.match(/^\/host\/([^/]+)/);
  const quizID = (hostRouteMatch && hostRouteMatch[1]) || "";
  const { data: game } = useGameAsHost({ quizID });
  const { startNewRound } = useQuestionRoundMutations({
    quizID,
    onStartNewRound: () => setLocation(`${location}`),
    onCloseRound: () => setLocation(`${location}?view=results`),
  });
  const endGame = useEndGame({
    quizID,
    onBeforeEndGame: () => setLocation(`/${quizID}/results`),
  });
  const [isShowing, setIsShowing] = useState(false);

  const currentIndex = game?.activeGameChannel.currentQuestionIndex;
  const questions = game?.quiz.questions;
  let nextIndex: number | undefined;
  if (
    typeof currentIndex === "number" &&
    questions &&
    currentIndex + 1 < questions.length
  ) {
    nextIndex = currentIndex + 1;
  }

  return (
    <div className="fixed top-1 right-1 flex flex-col gap-1">
      <button
        className="self-end h-8 w-8"
        onClick={() => setIsShowing((showing) => !showing)}
      >
        <Bug />
      </button>

      {isShowing && (
        <div className="p-4 border grid gap-2 bg-muted rounded shadow-xl">
          {user && (
            <>
              <h3 className="font-bold">{user.displayName}</h3>
              <p className="text-xs">{user.id}</p>
            </>
          )}

          {user ? (
            <button onClick={signout}>Signout</button>
          ) : (
            <>
              <button onClick={signin}>Signin</button>
              <button onClick={signinAnonymously}>Signin Anonymously</button>
            </>
          )}

          <button
            onClick={() => {
              console.log("next", nextIndex);
              nextIndex && startNewRound.mutate(nextIndex);
            }}
          >
            Next Question
          </button>
          <button onClick={() => endGame.mutate(quizID)}>End Game</button>
          {user?.role === UserRoles.Host && quizID && (
            <ResetGameButton quizID={quizID} />
          )}
        </div>
      )}
    </div>
  );
}
