import { GameLayout } from "@/components/layouts/GameLayout";
import { PinCodeInput } from "@/components/PinCodeInput";
import { useLocation } from "wouter";

export function JoinGame() {
  const [, setLocation] = useLocation();
  function handlePinComplete(pin: string) {
    if (pin) setLocation(`/${pin}`);
  }

  return (
    <GameLayout
      title="Join a Game"
      heading={<GameLayout.Heading>Join a Game</GameLayout.Heading>}
      mainContent={
        <form aria-label="Join a Game">
          <PinCodeInput digits={6} onComplete={handlePinComplete} />
        </form>
      }
    />
  );
}
