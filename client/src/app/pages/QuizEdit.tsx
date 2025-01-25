import { QuizEditorLayout } from "@/components/layouts/QuizEditorLayout";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { HostGameButton } from "@/features/quizzes/components/HostGameButton";
import { QuizDeleteButton } from "@/features/quizzes/components/QuizDeleteButton";
import { QuizPreview } from "@/features/quizzes/components/QuizPreview";
import { QuizSaveButton } from "@/features/quizzes/components/QuizSaveButton";
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
      <QuizSaveButton formID={markdownEditorID} />
    </>
  );

  const editor = isPending ? (
    <p>loading...</p>
  ) : (
    <MarkdownEditor
      formID={markdownEditorID}
      handleSave={(mdText) => saveQuiz.mutate(mdText)}
      hideSaveButton={true}
      initialMDText={data?.quiz._rawMD ?? ""}
    />
  );

  const preview =
    isPending || !data ? <p>loading...</p> : <QuizPreview quiz={data.quiz} />;

  if (isError) {
    // TODO: Flash message
    return <Redirect to={`~${base}`} />;
  }

  return (
    <QuizEditorLayout
      title={quizTitle}
      heading={quizTitle}
      actionBarItems={actionBarItems}
      editor={editor}
      preview={preview}
    />
  );
}
