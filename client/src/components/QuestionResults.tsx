import { LiveGame } from "../../../shared/game.types";
import { Question } from "../../../shared/quiz.types";
import { Markdown } from "./Markdown";
import { QuestionText } from "./QuestionText";

type ResultsProps = {
  question: Question;
  answerKey: LiveGame["answerKey"];
  playerAnswers: LiveGame["players"];
};

export function QuestionResults({
  question,
  answerKey,
  playerAnswers,
}: ResultsProps) {
  const correctAnswerIDs = answerKey[question.id] || [];
  const responseCounts = question.options.reduce((counts, option) => {
    counts[option.id] = 0;
    return counts;
  }, {} as Record<string, number>);
  playerAnswers.forEach((player) => {
    const answerID = player.answers[question.id];
    if (answerID && responseCounts.hasOwnProperty(answerID)) {
      responseCounts[answerID]++;
    }
  });
  const totalResponses = Object.values(responseCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <article>
      <QuestionText heading={question.heading} body={question.body} />

      {question.options.map((option) => {
        const isCorrect = correctAnswerIDs.includes(option.id);
        const count = responseCounts[option.id] || 0;
        const percentage = totalResponses ? (count / totalResponses) * 100 : 0;
        return (
          <div key={option.id} style={{ color: isCorrect ? "green" : "black" }}>
            <Markdown>{option.text}</Markdown> - {count} responses (
            {percentage.toFixed(1)}%)
            {isCorrect && <span> (Correct)</span>}
          </div>
        );
      })}
    </article>
  );
}
