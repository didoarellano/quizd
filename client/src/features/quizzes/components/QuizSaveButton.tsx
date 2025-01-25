import { Button } from "@/components/ui/button";

export function QuizSaveButton({ formID }: { formID: string }) {
  return (
    <Button size="sm" form={formID}>
      Save
    </Button>
  );
}
