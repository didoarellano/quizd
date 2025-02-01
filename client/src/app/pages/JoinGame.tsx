import { GameLayout } from "@/components/layouts/GameLayout";
import { PinCodeInput } from "@/components/PinCodeInput";
import { gameWithPinExists } from "@/services/game";
import { useState } from "react";
import { useLocation } from "wouter";

export function JoinGame() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);

  async function handlePinComplete(pin: string) {
    setLoading(true);
    const gameExists = await gameWithPinExists(pin);
    if (gameExists) {
      setLocation(`/${pin}`);
    } else {
      // TODO toast/notification/error message
      alert("Game not found");
    }
    setLoading(false);
  }

  return (
    <GameLayout
      title="Join a Game"
      heading={
        <GameLayout.Heading aria-live="polite">
          {loading ? (
            <>
              <span className="sr-only">PIN Entered</span> Joining Game...
            </>
          ) : (
            "Join a Game"
          )}
        </GameLayout.Heading>
      }
      mainContent={
        <form aria-label="Join a Game">
          <PinCodeInput digits={6} onComplete={handlePinComplete} />
        </form>
      }
    />
  );
}
