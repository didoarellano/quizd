import { Button } from "@/components/ui/button";
import { useState } from "react";

type QuizDeleteButtonProps = {
  onDeleteClick: () => void;
};

export function QuizDeleteButton({ onDeleteClick }: QuizDeleteButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!showConfirmation) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirmation(true)}
      >
        Delete Quiz
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowConfirmation(false)}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => {
          setShowConfirmation(false);
          onDeleteClick();
        }}
      >
        Confirm Delete
      </Button>
    </>
  );
}
