import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, updateDoc } from "firebase/firestore";
import { Link, useLocation, useSearch } from "wouter";
import { LiveGame } from "../../../shared/game.types";
import { QuestionDisplay } from "../components/QuestionDisplay";
import { QuestionResults } from "../components/QuestionResults";
import { db } from "../services/firebase";
import { useGameAsHost } from "../utils/useGame";

export function HostQuestion({ quizID }: { quizID: string }) {
  const { data: game } = useGameAsHost(quizID);
  const [location, setLocation] = useLocation();
  const searchParams = useSearch();
  const view = new URLSearchParams(searchParams).get("view");

  const queryClient = useQueryClient();
  const startNewQuestionRoundMutation = useMutation({
    mutationFn: async (currentQuestionIndex: number) => {
      if (!game) return;
      const activeGameChannelRef = doc(db, "activeGamesChannel", game.id);
      return updateDoc(activeGameChannelRef, {
        currentQuestionIndex,
        currentQuestionAnswer: null,
      }).then(() => currentQuestionIndex);
    },
    onSuccess: (currentQuestionIndex) => {
      if (!currentQuestionIndex) return;
      queryClient.setQueryData<LiveGame>(["games", quizID], (oldGame) => {
        if (!oldGame) return;
        const { activeGameChannel } = oldGame;
        activeGameChannel.currentQuestionIndex = currentQuestionIndex;
        return {
          ...oldGame,
          activeGameChannel,
        };
      });
      setLocation(`${location}`);
    },
  });

  const closeQuestionRoundMutation = useMutation({
    mutationFn: async (questionID: string) => {
      if (!game) return;
      const currentQuestionAnswer = game.answerKey[questionID];
      const activeGameChannelRef = doc(db, "activeGamesChannel", game.id);
      return updateDoc(activeGameChannelRef, { currentQuestionAnswer });
    },
    onSuccess: () => {
      setLocation(`${location}?view=results`);
    },
  });

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
      <button onClick={() => closeQuestionRoundMutation.mutate(question.id)}>
        Close Question
      </button>

      <br />
      {nextIndex && (
        <button onClick={() => startNewQuestionRoundMutation.mutate(nextIndex)}>
          Next Question
        </button>
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
