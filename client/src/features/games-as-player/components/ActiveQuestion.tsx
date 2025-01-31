import { GameLayout } from "@/components/layouts/GameLayout";
import { useSaveAnswerMutation } from "@/features/games-as-player/queries";
import { QuestionDisplay } from "@/features/quizzes/components/QuestionDisplay";
import { JoinGameResponse } from "@/types/game";
import { useAuth } from "@/utils/AuthContext";

type ActiveQuestionProps = {
  data: JoinGameResponse;
  gamePIN: string;
};

export function ActiveQuestion({ data, gamePIN }: ActiveQuestionProps) {
  const { user } = useAuth();
  const saveAnswer = useSaveAnswerMutation({
    docPath: `games/${data.gameID}/players/${user?.id}`,
    pin: gamePIN,
  });

  const answerKey = data.activeGameChannel.currentQuestionAnswer;
  const questionIsClosed = !!answerKey;
  const question =
    data.quiz.questions[data.activeGameChannel.currentQuestionIndex];
  const currentAnswerID = data.answers[question.id];

  let correctAnswers, playerAnswer, isCorrect;

  if (questionIsClosed) {
    correctAnswers = answerKey;
    playerAnswer = question.options.find((o) => o.id === currentAnswerID);
    isCorrect = answerKey.includes(currentAnswerID);
  }

  return (
    <GameLayout
      variant="in-game"
      title={`Playing ${data.quiz.title}`}
      heading={
        <>
          <GameLayout.Heading>
            {data.activeGameChannel.currentQuestionIndex + 1}/
            {data.quiz.questions.length}
          </GameLayout.Heading>
          <div className="w-18 p-4 bg-red-500 text-slate-50 leading-none text-center font-mono shadow rounded-sm">
            360
          </div>
        </>
      }
      mainContent={
        <QuestionDisplay key={question.id} question={question}>
          <QuestionDisplay.Heading>{question.heading}</QuestionDisplay.Heading>
          {question.body && (
            <QuestionDisplay.Body>{question.body}</QuestionDisplay.Body>
          )}
          <QuestionDisplay.Options
            questionID={question.id}
            options={question.options}
            activeOptionID={currentAnswerID}
            answerKey={answerKey}
            onOptionChange={(questionID, answerID) => {
              saveAnswer.mutate({ questionID, answerID });
            }}
          />
        </QuestionDisplay>
      }
    />
  );
}
