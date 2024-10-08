import { useEffect, useRef, useState } from "react";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { Link, useLocation, useRouter, type RouteComponentProps } from "wouter";

import { generateID, getQuiz, saveNewQuiz, updateQuiz } from "../services/quiz";
import { QuizPreview } from "../components/QuizPreview";
import { useAuth } from "../contexts/AuthContext";
import { Teacher, UserRoles } from "../services/auth";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { parseQuiz } from "../utils/markdown";

type QuizEditorProps = {
  quizID?: string;
} & Partial<RouteComponentProps>;

export function QuizEditor({ quizID }: QuizEditorProps) {
  const quizSnap = useRef<DocumentSnapshot | null>(null);
  const [quizData, setQuizData] = useState<DocumentData | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [location, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id || user?.role !== UserRoles.Teacher) return;
    if (!quizID) return setIsLoadingQuiz(false);
    setIsLoadingQuiz(true);
    getQuiz(quizID, user.id)
      .then(({ docSnap, quizData: data }) => {
        quizSnap.current = docSnap;
        setQuizData(data);
      })
      .catch((e) => {
        // TODO: Flash message
        setLocation(`~${base}`);
      })
      .finally(() => setIsLoadingQuiz(false));
  }, []);

  async function handleSave(mdText: string) {
    let quiz = parseQuiz(generateID, mdText);
    quiz._rawMD = mdText;
    if (!quizID) {
      const quizDocRef = await saveNewQuiz(user as Teacher, quiz);
      const loc = `~${base}/${quizDocRef.id}`;
      setLocation(loc, { replace: true });
      return;
    }
    if (quizSnap?.current?.ref) {
      updateQuiz(quizSnap.current.ref, quiz);
      setQuizData(quiz);
    }
  }

  return (
    <>
      <h1>
        {!quizID ? "Create Quiz" : `Editing Quiz: ${quizData?.title ?? ""}`}
      </h1>

      {quizID && <Link href={`${location}/host`}>Host Game</Link>}

      {isLoadingQuiz ? (
        <p>...</p>
      ) : (
        <>
          <MarkdownEditor
            initialMDText={quizData?._rawMD ?? ""}
            handleSave={handleSave}
          />

          <hr />

          {quizData && <QuizPreview quiz={quizData} />}
        </>
      )}
    </>
  );
}
