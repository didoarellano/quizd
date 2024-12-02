import { Link, useRouter } from "wouter";

export function HostGameButton({ quizID }: { quizID: string }) {
  const { base } = useRouter();
  const href = `~${base.replace("quiz", "host")}/${quizID}`;
  return <Link href={href}>Host Game</Link>;
}
