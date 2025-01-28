import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import {
  useEndGame,
  useGameAsHost,
  useQuestionRoundMutations,
} from "@/features/games-as-host/queries";
import { QuestionDisplay } from "@/features/quizzes/components/QuestionDisplay";
import { Answer } from "@/types/quiz";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { useLocation, useSearch } from "wouter";

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
  let answerKey: Answer[] | undefined;
  if (view === "results") answerKey = game.answerKey[question.id];

  return (
    <div className="min-h-screen flex flex-col gap-8">
      <header className="md:h-[4rem] p-4 border-b">
        <div className="h-full container mx-auto grid grid-cols-[auto_1fr_auto] gap-2 items-center justify-between">
          <BackButton />
          <h1 className="text-2xl/normal font-bold text-left truncate">
            {game.quiz.title}
          </h1>
          <div className="flex gap-2 items-center justify-end">
            <div className="text-2xl/normal font-mono">
              {currentIndex + 1}/{questions.length}
            </div>

            {view !== "results" ? (
              <Button
                size="sm"
                onClick={() => closeCurrentRound.mutate(question.id)}
              >
                Close Question
              </Button>
            ) : nextIndex ? (
              <Button size="sm" onClick={() => startNewRound.mutate(nextIndex)}>
                Next Question
              </Button>
            ) : (
              <Button size="sm" onClick={() => endGame.mutate(quizID)}>
                End Game
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <QuestionDisplay
          key={question.id}
          question={question}
          size="xl"
          className="pointer-events-none"
        >
          <QuestionDisplay.Heading>{question.heading}</QuestionDisplay.Heading>

          {question.body && (
            <QuestionDisplay.Body>{question.body}</QuestionDisplay.Body>
          )}

          <QuestionDisplay.Options
            questionID={question.id}
            options={question.options}
            answerKey={answerKey}
          />
        </QuestionDisplay>
      </main>
    </div>
  );
}
