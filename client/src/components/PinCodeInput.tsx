import { KeyboardEvent, useEffect, useRef, useState } from "react";

type PinCodeInputProps = {
  digits: number;
  onComplete: (pin: string) => void;
};

export function PinCodeInput({ digits = 6, onComplete }: PinCodeInputProps) {
  const [pinCode, setPinCode] = useState<string[]>(new Array(digits).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleChange(index: number, value: string) {
    const newPinCode = [...pinCode];
    newPinCode[index] = value;
    setPinCode(newPinCode);

    if (value && index < digits - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newPinCode.every((digit) => digit !== "")) {
      onComplete(newPinCode.join(""));
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    // Focus previous if current is empty and not first
    if (e.key.toLowerCase() === "backspace" && !pinCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <>
      <label
        htmlFor="digit-0"
        className="w-full block mb-2 cursor-pointer text-xl font-bold"
      >
        Enter 6-digit PIN Code
      </label>

      <div className="flex gap-2">
        {pinCode.map((digit, i) => (
          <input
            key={i}
            id={`digit-${i}`}
            type="text"
            inputMode="numeric"
            required
            pattern="\d"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            ref={(el) => (inputRefs.current[i] = el)}
            className="w-12 h-12 border text-center text-2xl font-bold font-mono bg-slate-100 shadow-sm"
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}
