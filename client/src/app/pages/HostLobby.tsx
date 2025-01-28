import { Button } from "@/components/ui/button";
import { PlayerList } from "@/features/games-as-host/components/PlayerList";
import { useGameAsHost, useStartGame } from "@/features/games-as-host/queries";
import { GameStatus } from "@/types/game";
import { pluralise } from "@/utils/pluralise";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Link, useLocation } from "wouter";

const startButtonText = {
  [GameStatus.PENDING]: "Start Game",
  [GameStatus.ONGOING]: "Continue Game",
  [GameStatus.COMPLETED]: "View Results",
};

export function HostLobby({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost({ quizID });
  const startGame = useStartGame({ game: game ?? null });
  const players = game?.players;
  const [location] = useLocation();

  useDocumentTitle(`Host ${game?.quiz.title ?? "Quiz"}`);

  return (
    <main className="container mx-auto p-4 grid gap-4 md:grid-cols-2 items-start text-3xl/normal">
      <div className="md:order-2 grid gap-4 p-4 border bg-teal-600 text-slate-100 shadow rounded-sm">
        <h2 className="font-bold">Join the game</h2>
        <p>
          Go to:
          <span className="w-fit py-2 px-4 block font-semibold bg-slate-100 text-teal-600 rounded-sm md:text-nowrap">
            {window.location.href
              .replace(/https?:\/\//g, "")
              .replace(/host\/.*/i, "play")}
          </span>
        </p>
        <p>
          Enter PIN code:
          <span className="w-fit py-2 px-4 block font-semibold font-mono bg-slate-100 text-teal-600 rounded-sm">
            {game?.pin}
          </span>
        </p>
      </div>

      <div className="md:order-1">
        {game && (
          <>
            <h2 className="p-4 text-6xl/none font-black bg-slate-600 text-slate-100 shadow rounded-sm">
              {game.quiz.title}
            </h2>
            <div className="p-4">
              <p>{game.quiz.description}</p>
              <Button size="lg" asChild={true}>
                <Link
                  href={`${location}/play`}
                  onClick={() => startGame.mutate()}
                >
                  {startButtonText[game.status]}
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="md:order-last md:col-span-2">
        <h2 className="font-black mb-4">
          {players && players.length > 0
            ? `${players.length} ${pluralise("Player", players.length)}`
            : "Waiting for players…"}
        </h2>
        {players && (
          <PlayerList players={players} className="grid gap-2 md:grid-cols-3" />
        )}
      </div>
    </main>
  );
}
