import { QuizEditorLayout } from "@/components/layouts/QuizEditorLayout";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { useSaveNewQuiz } from "@/features/quizzes/queries";
import { useAuth } from "@/utils/AuthContext";
import { useLocation, useRouter } from "wouter";

const INITIAL_MD_TEXT = `---
title: Untitled Quiz
description: Untitled quiz description
---

`;

export function QuizCreate() {
  const [, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();
  const saveNewQuiz = useSaveNewQuiz({
    onSuccess: (quizRef) =>
      setLocation(`~${base}/${quizRef.id}`, { replace: true }),
  });
  const markdownEditorID = "markdown-editor-id";

  return (
    <QuizEditorLayout
      title="Create New Quiz"
      heading="Untitled Quiz"
      actionBarItems={
        <Button size="sm" form={markdownEditorID}>
          Save
        </Button>
      }
      editor={
        <MarkdownEditor
          formID={markdownEditorID}
          handleSave={(mdText) =>
            user?.id && saveNewQuiz.mutate({ userID: user.id, mdText })
          }
          hideSaveButton={true}
          initialMDText={INITIAL_MD_TEXT}
        />
      }
    />
  );
}
