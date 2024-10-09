import { useState } from "react";
import { deleteQuizByID } from "../services/quiz";

type QuizDeleteButtonProps = {
  quizID: string;
  onDelete: () => void;
};

export function QuizDeleteButton({ quizID, onDelete }: QuizDeleteButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!showConfirmation) {
    return (
      <button onClick={() => setShowConfirmation(true)}>Delete Quiz</button>
    );
  }

  return (
    <>
      <button onClick={() => setShowConfirmation(false)}>Cancel</button>
      <button onClick={() => deleteQuizByID(quizID).then(onDelete)}>
        Confirm Delete
      </button>
    </>
  );
}
