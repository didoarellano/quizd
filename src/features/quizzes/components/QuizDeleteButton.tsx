import { useState } from "react";

type QuizDeleteButtonProps = {
  onDeleteClick: () => void;
};

export function QuizDeleteButton({ onDeleteClick }: QuizDeleteButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!showConfirmation) {
    return (
      <button onClick={() => setShowConfirmation(true)}>Delete Quiz</button>
    );
  }

  return (
    <>
      <button onClick={() => setShowConfirmation(false)}>Cancel</button>
      <button
        onClick={() => {
          setShowConfirmation(false);
          onDeleteClick();
        }}
      >
        Confirm Delete
      </button>
    </>
  );
}
