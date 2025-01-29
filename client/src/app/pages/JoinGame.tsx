import { PinCodeInput } from "@/components/PinCodeInput";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { useLocation } from "wouter";

export function JoinGame() {
  const [, setLocation] = useLocation();

  useDocumentTitle(`Join a Game`);

  function handlePinComplete(pin: string) {
    if (pin) setLocation(`/${pin}`);
  }

  return (
    <main className="h-screen p-2 flex items-center justify-center bg-teal-600 ">
      <form aria-label="Join a Game">
        <h1 className="w-full mb-2 uppercase text-5xl font-black text-white [text-shadow:_2px_2px_0_rgb(0_0_0_/_30%)] text-left">
          Join a Game
        </h1>
        <div className="p-8 border flex flex-col gap-4 items-center bg-white shadow-lg rounded-sm">
          <PinCodeInput digits={6} onComplete={handlePinComplete} />
        </div>
      </form>
    </main>
  );
}
