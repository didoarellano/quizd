import { Button } from "@/components/ui/button";
import { ComponentProps, useState } from "react";

type QuizDeleteButtonProps = ComponentProps<typeof Button> & {
  onDeleteClick: () => void;
};

export function QuizDeleteButton({
  onDeleteClick,
  ...props
}: QuizDeleteButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!showConfirmation) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowConfirmation(true)}
        {...props}
      >
        Delete
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
