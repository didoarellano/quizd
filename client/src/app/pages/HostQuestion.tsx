import { QuestionDisplay } from "@/components/QuestionDisplay";
import { QuestionResults } from "@/features/games-as-host/components/QuestionResults";
import {
  useEndGame,
  useGameAsHost,
  useQuestionRoundMutations,
} from "@/features/games-as-host/queries";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { Link, useLocation, useSearch } from "wouter";

export function HostQuestion({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost({ quizID });
  const searchParams = useSearch();
  const view = new URLSearchParams(searchParams).get("view");
  const [location, setLocation] = useLocation();
  const { startNewRound, closeCurrentRound } = useQuestionRoundMutations({
    quizID,
    onStartNewRound: () => setLocation(`${location}`),
    onCloseRound: () => setLocation(`${location}?view=results`),
  });
  const endGame = useEndGame({
    quizID,
    onBeforeEndGame: () => setLocation(`/${quizID}/results`),
  });

  useDocumentTitle(`Playing ${game?.quiz.title ?? "Quiz"}`);

  if (!game) return <p>...</p>;

  const currentIndex = game.activeGameChannel.currentQuestionIndex;
  const questions = game.quiz.questions;
  const question = questions[currentIndex];
  const nextIndex = currentIndex + 1 < questions.length && currentIndex + 1;

  return (
    <>
      <h1>Current Question</h1>
      <Link href={location.replace("/play", "")}>Host Lobby</Link>
      <Link href={location.replace("play", "results")}>Results</Link>

      <br />
      <button onClick={() => closeCurrentRound.mutate(question.id)}>
        Close Question
      </button>

      <br />
      {nextIndex ? (
        <button onClick={() => startNewRound.mutate(nextIndex)}>
          Next Question
        </button>
      ) : (
        <button onClick={() => endGame.mutate(quizID)}>End Game</button>
      )}

      {view === "results" ? (
        <QuestionResults
          key={question.id}
          question={question}
          answerKey={game.answerKey}
          playerAnswers={game.players}
        />
      ) : (
        <QuestionDisplay key={question.id} question={question} />
      )}
    </>
  );
}
