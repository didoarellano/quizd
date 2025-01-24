import { BackButton } from "@/components/BackButton";
import { Markdown } from "@/components/Markdown";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { QuestionText } from "@/components/QuestionText";
import { Button } from "@/components/ui/button";
import { HostGameButton } from "@/features/quizzes/components/HostGameButton";
import { QuizDeleteButton } from "@/features/quizzes/components/QuizDeleteButton";
import {
  useDeleteQuiz,
  useQuiz,
  useSaveNewQuiz,
  useSaveQuiz,
} from "@/features/quizzes/queries";
import { UserRoles } from "@/services/auth";
import { useAuth } from "@/utils/AuthContext";
import { NotAllowedError, QuizNotFoundError } from "@/utils/errors";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import {
  Redirect,
  useLocation,
  useRouter,
  type RouteComponentProps,
} from "wouter";

type QuizEditorProps = {
  quizID?: string;
  mode: "create" | "edit";
} & Partial<RouteComponentProps>;

export function QuizEditor({ quizID, mode }: QuizEditorProps) {
  const [, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();
  const { isPending, isError, data } = useQuiz({
    quizID: quizID ?? null,
    userID: user?.id ?? null,
    queryOptions: {
      enabled: !!(mode === "edit" && user?.role === UserRoles.Host),
      retry: (_, error) => {
        return (
          !(error instanceof QuizNotFoundError) ||
          !(error instanceof NotAllowedError)
        );
      },
    },
  });
  const saveNewQuiz = useSaveNewQuiz({
    onSuccess: (quizRef) =>
      setLocation(`~${base}/${quizRef.id}`, { replace: true }),
  });
  const deleteQuiz = useDeleteQuiz({
    onSuccess: () => setLocation("/", { replace: true }),
  });
  const saveQuiz = useSaveQuiz({
    quizID: quizID ?? null,
    quizRef: data?.docSnap.ref ?? null,
  });

  const verb = mode[0].toUpperCase() + mode.slice(1);
  const subject = mode === "create" ? "New Quiz" : data?.quiz.title ?? "Quiz";
  useDocumentTitle(`${verb} ${subject}`);

  if (isError) {
    // TODO: Flash message
    return <Redirect to={`~${base}`} />;
  }

  const createMode = mode === "create";
  const headerTitle =
    mode === "create" ? "Untitled Quiz" : data?.quiz?.title ?? "";
  const initialMDText = createMode
    ? "---\ntitle: Untitled Quiz\n---"
    : data?.quiz._rawMD;

  const markdownEditorID = "markdown-editor-id";

  function handleMarkdownSave(mdText: string) {
    if (mode === "create" && user?.id) {
      saveNewQuiz.mutate({ userID: user.id, mdText });
    } else {
      saveQuiz.mutate(mdText);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-[4rem] p-4 border-b">
        <div className="h-full container mx-auto grid grid-cols-3 justify-between">
          <BackButton />
          <h1 className="text-center text-2xl font-bold">{headerTitle}</h1>
          <div className="flex gap-2 justify-end">
            {!createMode && (
              <>
                <QuizDeleteButton
                  onDeleteClick={() => quizID && deleteQuiz.mutate(quizID)}
                />
                <HostGameButton quizID={quizID as string} />
              </>
            )}
            <Button size="sm" form={markdownEditorID}>
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-4rem)] container mx-auto grid grid-cols-2 gap-4">
        {!createMode && isPending ? (
          <p>loading...</p>
        ) : (
          <>
            <section className="h-full p-2 bg-slate-50">
              <MarkdownEditor
                formID={markdownEditorID}
                handleSave={handleMarkdownSave}
                hideSaveButton={true}
                initialMDText={initialMDText ?? ""}
              />
            </section>
            <section className="h-full py-4 px-2">
              {!createMode && (
                <ol className="grid gap-8">
                  {data?.quiz.questions.map((q) => (
                    <li key={q.id}>
                      <QuestionText heading={q.heading} body={q.body} />
                      <ul className="grid gap-2 mt-4">
                        {q.options.map((option) => (
                          <li key={option.id} className="p-4 border">
                            <label>
                              <Markdown>{option.text}</Markdown>
                              <input
                                type="radio"
                                name={q.id}
                                className="hidden"
                              />
                            </label>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
