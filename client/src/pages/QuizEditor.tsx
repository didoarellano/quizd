import {
  Redirect,
  useLocation,
  useRouter,
  type RouteComponentProps,
} from "wouter";
import { HostGameButton } from "../components/HostGameButton";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { QuizDeleteButton } from "../components/QuizDeleteButton";
import { QuizPreview } from "../components/QuizPreview";
import { useAuth } from "../contexts/AuthContext";
import { UserRoles } from "../services/auth";
import { NotAllowedError, QuizNotFoundError } from "../utils/errors";
import {
  useDeleteQuiz,
  useQuiz,
  useSaveNewQuiz,
  useSaveQuiz,
} from "../utils/useQuiz";

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
      enabled: !!(mode === "edit" && user?.role === UserRoles.Teacher),
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
