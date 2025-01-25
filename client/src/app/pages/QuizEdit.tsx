import { QuizEditorLayout } from "@/components/layouts/QuizEditorLayout";
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
  const quizTitle = data?.quiz.title ?? "Quiz";
  const markdownEditorID = "markdown-editor-id";

  const actionBarItems = (
    <>
      <QuizDeleteButton
        className="hidden md:block"
        onDeleteClick={() => deleteQuiz.mutate(quizID)}
      />
      <HostGameButton quizID={quizID} />
      <Button size="sm" form={markdownEditorID}>
        Save
      </Button>
    </>
  );

  const editor = (
    <MarkdownEditor
      formID={markdownEditorID}
      handleSave={(mdText) => saveQuiz.mutate(mdText)}
      hideSaveButton={true}
      initialMDText={data?.quiz._rawMD ?? ""}
    />
  );

  const preview = (
    <>
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
                    <input type="radio" name={q.id} className="hidden" />
                  </label>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </>
  );

  if (isError) {
    // TODO: Flash message
    return <Redirect to={`~${base}`} />;
  }

  return (
    <QuizEditorLayout
      title={quizTitle}
      heading={quizTitle}
      actionBarItems={actionBarItems}
      editor={isPending ? <p>loading...</p> : editor}
      preview={preview}
    />
  );
}
