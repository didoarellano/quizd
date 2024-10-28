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
  mode: "create" | "edit";
} & Partial<RouteComponentProps>;

export function QuizEditor({ quizID, mode }: QuizEditorProps) {
  const [, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();

  const queryClient = useQueryClient();
  const { isPending, isError, data } = useQuery({
    queryKey: ["quizzes", quizID],
    queryFn: async () => {
      if (!quizID) throw new Error("QuizID is required");
      if (!user?.id) throw new Error("User not logged in");
      return getQuiz(quizID, user.id);
    },
    enabled: !!(mode === "edit" && user?.role === UserRoles.Teacher),
    retry: (_, error) => {
      return (
        !(error instanceof QuizNotFoundError) ||
        !(error instanceof NotAllowedError)
      );
    },
  });

  const { mutate: deleteQuiz } = useMutation({
    mutationFn: async () => {
      if (!quizID) throw new Error("QuizID is required");
      return deleteQuizByID(quizID);
    },
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
    mutationFn: async (mdText: string) => {
      let quiz = parseQuiz(generateID, mdText);
      quiz._rawMD = mdText;
      if (data?.docSnap.ref) {
        return updateQuiz(data.docSnap.ref, quiz);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizzes", quizID] });
    },
  });

  if (mode === "create") {
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
      <h1>Editing Quiz: {data?.quiz?.title ?? ""}</h1>
      <Link href={`~${import.meta.env.VITE_BASE_URL}/host/${quizID}`}>
        Host Game
      </Link>
      {isPending ? (
        <p>loading...</p>
      ) : (
        <>
          <QuizDeleteButton onDeleteClick={deleteQuiz} />
          <MarkdownEditor
            initialMDText={data.quiz._rawMD}
            handleSave={saveQuiz}
          />
          <hr />
          <QuizPreview quiz={data.quiz} />
        </>
      )}
    </>
  );
}
