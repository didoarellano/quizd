import { Link } from "wouter";

export function GameQuestion() {
  return (
    <>
      <h1>Current Question</h1>
      <Link href="/">Host Lobby</Link>
      <Link href="/results">Results</Link>
    </>
  );
}
