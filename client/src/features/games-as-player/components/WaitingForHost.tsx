import { GameLayout } from "@/components/layouts/GameLayout";

export function WaitingForHost({ username }: { username: string }) {
  return (
    <GameLayout
      title="Waiting for host to start the game"
      heading={<GameLayout.Heading>Waiting...</GameLayout.Heading>}
      mainContent={
        <>
          <h1 className="text-xl font-bold">Welcome {username}!</h1>
          <p>Waiting for host to start the game.</p>
        </>
      }
    />
  );
}
