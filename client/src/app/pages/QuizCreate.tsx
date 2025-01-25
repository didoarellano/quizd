import { BackButton } from "@/components/BackButton";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { useSaveNewQuiz } from "@/features/quizzes/queries";
import { useAuth } from "@/utils/AuthContext";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
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

  useDocumentTitle("Create New Quiz");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="md:h-[4rem] p-4 border-b">
        <div className="h-full container mx-auto grid grid-cols-[auto_1fr_auto] gap-2 md:grid-cols-[1fr_2fr_1fr] justify-between">
          <BackButton />
          <h1 className="text-2xl/normal font-bold text-left md:text-center truncate">
            Untitled Quiz
          </h1>
          <Button size="sm" form={markdownEditorID}>
            Save
          </Button>
        </div>
      </header>
      <main className="md:h-[calc(100vh-4rem)] container mx-auto grid md:grid-cols-2 gap-4">
        <section className="h-full p-2 md:overflow-auto bg-slate-50">
          <MarkdownEditor
            formID={markdownEditorID}
            handleSave={(mdText: string) =>
              user?.id && saveNewQuiz.mutate({ userID: user.id, mdText })
            }
            hideSaveButton={true}
            initialMDText={INITIAL_MD_TEXT}
          />
        </section>
        <section className="h-full py-4 md:overflow-auto px-2"></section>
      </main>
    </div>
  );
}
