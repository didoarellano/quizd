import { FormEvent, useRef } from "react";
import { useLocation } from "wouter";

export function JoinGame() {
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const pin = inputRef?.current?.value;
    if (pin) setLocation(`/${pin}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="pin"
        ref={inputRef}
        type="text"
        minLength={6}
        maxLength={6}
        placeholder="Enter PIN code"
        required
      />
      <button>Join Game</button>
    </form>
  );
}
