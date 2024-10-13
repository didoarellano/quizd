import { Link, Redirect, useSearch } from "wouter";
import { Option } from "../components/Option";
import { QuestionText } from "../components/QuestionText";
import { useGame } from "../utils/useGame";

export function GameQuestion({ quizID }: { quizID: string }) {
  const { game } = useGame(quizID);
  const searchParams = useSearch();

  if (!game || !searchParams) return <Redirect to={`/`} />;

  const q = Number(Object.fromEntries(new URLSearchParams(searchParams))?.q);
  const question = game.quizData.questions[q];

  return (
    <>
      <h1>Current Question</h1>
      <Link href="/">Host Lobby</Link>
      <Link href="/results">Results</Link>

      <article>
        <QuestionText heading={question.heading} body={question.body} />
        <div>
          {question.options.map((option) => (
            <Option key={option.id} text={option.text} />
          ))}
        </div>
      </article>
    </>
  );
}
