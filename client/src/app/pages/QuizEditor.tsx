import { MarkdownEditor } from "@/components/MarkdownEditor";
import { HostGameButton } from "@/features/quizzes/components/HostGameButton";
import { QuizDeleteButton } from "@/features/quizzes/components/QuizDeleteButton";
import { QuizPreview } from "@/features/quizzes/components/QuizPreview";
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

  if (mode === "create") {
    return (
      <>
        <h1>Create Quiz</h1>
        <MarkdownEditor
          initialMDText=""
          handleSave={(mdText) =>
            user?.id && saveNewQuiz.mutate({ userID: user.id, mdText })
          }
        />
      </>
    );
  }

  if (isError) {
    // TODO: Flash message
    return <Redirect to={`~${base}`} />;
  }

  return (
    <>
      <h1>Editing Quiz: {data?.quiz?.title ?? ""}</h1>
      <HostGameButton quizID={quizID as string} />
      {isPending ? (
        <p>loading...</p>
      ) : (
        <>
          <QuizDeleteButton
            onDeleteClick={() => quizID && deleteQuiz.mutate(quizID)}
          />
          <MarkdownEditor
            initialMDText={data.quiz._rawMD}
            handleSave={(mdText) => saveQuiz.mutate(mdText)}
          />
          <hr />
          <QuizPreview quiz={data.quiz} />
        </>
      )}
    </>
  );
}
