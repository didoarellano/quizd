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
    <form aria-label="join game" onSubmit={handleSubmit}>
      <label htmlFor="pin">Pin Code</label>
      <input
        id="pin"
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
