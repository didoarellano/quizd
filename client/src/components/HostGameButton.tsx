import { Link } from "wouter";

export function HostGameButton({ quizID }: { quizID: string }) {
  return (
    <Link href={`~${import.meta.env.VITE_BASE_URL}/host/${quizID}`}>
      Host Game
    </Link>
  );
}
