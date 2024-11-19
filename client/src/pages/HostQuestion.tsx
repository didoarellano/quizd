import { Link, useLocation, useSearch } from "wouter";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { QuestionResults } from "../components/QuestionResults";
import {
  useEndGameMutation,
  useGameAsHost,
  useQuestionRoundMutations,
} from "../utils/useGameAsHost";

export function HostQuestion({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);
  const searchParams = useSearch();
  const view = new URLSearchParams(searchParams).get("view");
  const [location, setLocation] = useLocation();
  const { startNewRound, closeCurrentRound } = useQuestionRoundMutations({
    quizID,
    docPath: `activeGamesChannel/${game?.id || ""}`,
    onStartNewRound: () => setLocation(`${location}`),
    onCloseRound: () => setLocation(`${location}?view=results`),
  });
  const endGame = useEndGameMutation({
    quizID,
    onEndGame: () => setLocation(`/results`),
  });

  if (!game) return <p>...</p>;

  const currentIndex = game.activeGameChannel.currentQuestionIndex;
  const questions = game.quiz.questions;
  const question = questions[currentIndex];
  const nextIndex = currentIndex + 1 < questions.length && currentIndex + 1;

  return (
    <>
      <h1>Current Question</h1>
      <Link href="/">Host Lobby</Link>
      <Link href="/results">Results</Link>

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
