import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Link,
  Redirect,
  useLocation,
  useRouter,
  type RouteComponentProps,
} from "wouter";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { QuizDeleteButton } from "../components/QuizDeleteButton";
import { QuizPreview } from "../components/QuizPreview";
import { useAuth } from "../contexts/AuthContext";
import { Teacher, UserRoles } from "../services/auth";
import {
  deleteQuizByID,
  generateID,
  getQuiz,
  saveNewQuiz,
  updateQuiz,
} from "../services/quiz";
import { NotAllowedError, QuizNotFoundError } from "../utils/errors";
import { parseQuiz } from "../utils/markdown";

type QuizEditorProps = {
  quizID?: string;
} & Partial<RouteComponentProps>;

export function QuizEditor({ quizID }: QuizEditorProps) {
  const [, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();

  const queryClient = useQueryClient();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["quizzes", quizID],
    queryFn: () => getQuiz(quizID, user.id),
    retry: (_, error) => {
      return (
        !(error instanceof QuizNotFoundError) ||
        !(error instanceof NotAllowedError)
      );
    },
  });

  const { mutate: deleteQuiz } = useMutation({
    mutationFn: () => deleteQuizByID(quizID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", quizID] });
      setLocation("/", { replace: true });
    },
  });

  const { mutate: createNewQuiz } = useMutation({
    mutationFn: (mdText: string) => {
      let quiz = parseQuiz(generateID, mdText);
      quiz._rawMD = mdText;
      return saveNewQuiz(user as Teacher, quiz);
    },
    onSuccess: (quizRef) => {
      queryClient.invalidateQueries({ queryKey: ["quizzes"] });
      setLocation(`~${base}/${quizRef.id}`, { replace: true });
    },
  });

  const { mutate: saveQuiz } = useMutation({
    mutationFn: (mdText: string) => {
      let quiz = parseQuiz(generateID, mdText);
      quiz._rawMD = mdText;
      return updateQuiz(data.quizSnap.ref, quiz);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", quizID] });
    },
  });

  if (!quizID) {
    return (
      <>
        <h1>Create Quiz</h1>
        <MarkdownEditor initialMDText="" handleSave={createNewQuiz} />
      </>
    );
  }

  if (isError) {
    // TODO: Flash message
    return <Redirect to={`~${base}`} />;
  }

  return (
    <>
      <h1>Editing Quiz: {data?.quizData?.title ?? ""}</h1>
      <Link href={`~${import.meta.env.VITE_BASE_URL}/host/${quizID}`}>
        Host Game
      </Link>
      {isPending ? (
        <p>loading...</p>
      ) : (
        <>
          <QuizDeleteButton onDeleteClick={deleteQuiz} />
          <MarkdownEditor
            initialMDText={data.quizData._rawMD}
            handleSave={saveQuiz}
          />
          <hr />
          <QuizPreview quiz={data.quizData} />
        </>
      )}
    </>
  );
}
