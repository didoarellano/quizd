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

type QuizEditProps = {
  quizID: string;
} & Partial<RouteComponentProps>;

export function QuizEdit({ quizID }: QuizEditProps) {
  const [, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();
  const { isPending, isError, data } = useQuiz({
    quizID,
    userID: user?.id ?? null,
    queryOptions: {
      enabled: user?.role === UserRoles.Host,
      retry: (_, error) => {
        return (
          !(error instanceof QuizNotFoundError) ||
          !(error instanceof NotAllowedError)
        );
      },
    },
  });
  const deleteQuiz = useDeleteQuiz({
    onSuccess: () => setLocation("/", { replace: true }),
  });
  const saveQuiz = useSaveQuiz({
    quizID,
    quizRef: data?.docSnap.ref ?? null,
  });

  const quizTitle = data?.quiz.title;
  const markdownEditorID = "markdown-editor-id";

  useDocumentTitle(quizTitle ?? "Quiz");

  if (isError) {
    // TODO: Flash message
    return <Redirect to={`~${base}`} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="md:h-[4rem] p-4 border-b">
        <div className="h-full container mx-auto grid grid-cols-[auto_1fr_auto] gap-2 md:grid-cols-[1fr_2fr_1fr] justify-between">
          <BackButton />
          <h1 className="text-2xl/normal font-bold text-left md:text-center truncate">
            {quizTitle}
          </h1>
          <div className="flex gap-2 justify-end">
            <QuizDeleteButton
              className="hidden md:block"
              onDeleteClick={() => deleteQuiz.mutate(quizID)}
            />
            <HostGameButton quizID={quizID} />
            <Button size="sm" form={markdownEditorID}>
              Save
            </Button>
          </div>
        </div>
      </header>

      <main className="md:h-[calc(100vh-4rem)] container mx-auto grid md:grid-cols-2 gap-4">
        {isPending ? (
          <p>loading...</p>
        ) : (
          <>
            <section className="h-full p-2 md:overflow-auto bg-slate-50">
              <MarkdownEditor
                formID={markdownEditorID}
                handleSave={(mdText) => saveQuiz.mutate(mdText)}
                hideSaveButton={true}
                initialMDText={data?.quiz._rawMD ?? ""}
              />
            </section>
            <section className="h-full py-4 md:overflow-auto px-2">
              <h3 className="text-2xl font-bold mb-2 md:hidden">Preview</h3>
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
            </section>
          </>
        )}
      </main>
    </div>
  );
}
