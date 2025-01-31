import { GameLayout } from "@/components/layouts/GameLayout";

export function LoadingGame() {
  return (
    <GameLayout
      title="Joining Game"
      heading={<GameLayout.Heading>Joining...</GameLayout.Heading>}
      mainContent={<p>Just a sec. Looking for your game.</p>}
    />
  );
}
