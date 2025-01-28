import { BackButton } from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { QuestionResults } from "@/features/games-as-host/components/QuestionResults";
import {
  useGameAsHost,
  useQuestionRoundMutations,
} from "@/features/games-as-host/queries";
import { QuestionDisplay } from "@/features/quizzes/components/QuestionDisplay";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { useLocation, useSearch } from "wouter";

export function HostQuestion({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost({ quizID });
  const searchParams = useSearch();
  const view = new URLSearchParams(searchParams).get("view");
  const [location, setLocation] = useLocation();
  const { closeCurrentRound } = useQuestionRoundMutations({
    quizID,
    onCloseRound: () => setLocation(`${location}?view=results`),
  });

  useDocumentTitle(`Playing ${game?.quiz.title ?? "Quiz"}`);

  if (!game) return <p>...</p>;

  const currentIndex = game.activeGameChannel.currentQuestionIndex;
  const questions = game.quiz.questions;
  const question = questions[currentIndex];

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

            <Button
              size="sm"
              onClick={() => closeCurrentRound.mutate(question.id)}
            >
              Close Question
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {view === "results" ? (
          <QuestionResults
            key={question.id}
            question={question}
            answerKey={game.answerKey}
            playerAnswers={game.players}
          />
        ) : (
          <QuestionDisplay
            key={question.id}
            question={question}
            size="xl"
            className="pointer-events-none"
          >
            <QuestionDisplay.Heading>
              {question.heading}
            </QuestionDisplay.Heading>

            {question.body && (
              <QuestionDisplay.Body>{question.body}</QuestionDisplay.Body>
            )}
            <QuestionDisplay.Options
              questionID={question.id}
              options={question.options}
            />
          </QuestionDisplay>
        )}
      </main>
    </div>
  );
}
