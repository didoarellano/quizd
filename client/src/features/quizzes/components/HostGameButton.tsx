import { Button } from "@/components/ui/button";
import { Link, useRouter } from "wouter";

export function HostGameButton({ quizID }: { quizID: string }) {
  const { base } = useRouter();
  const href = `~${base.replace("quiz", "host")}/${quizID}`;
  return (
    <Button asChild={true} size="sm">
      <Link href={href}>Host</Link>
    </Button>
  );
}
