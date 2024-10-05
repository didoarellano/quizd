import { useEffect, useRef, useState } from "react";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { Link, useLocation, useRouter } from "wouter";

import { generateID, getQuiz, saveNewQuiz, updateQuiz } from "../services/quiz";
import { useAuth } from "../contexts/AuthContext";
import { Teacher, UserRoles } from "../services/auth";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { parseQuiz } from "../utils/markdown";

type QuizEditorProps = {
  quizID?: string;
};

export function QuizEditor({ quizID }: QuizEditorProps) {
  const quizSnap = useRef<DocumentSnapshot | null>(null);
  const [quizData, setQuizData] = useState<DocumentData | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [location, setLocation] = useLocation();
  const { base } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    async function loadQuiz(quizID: string) {
      if (!user?.id || user?.role !== UserRoles.Teacher) return;
      const _quizSnap = await getQuiz(quizID);

      if (_quizSnap.exists()) {
        quizSnap.current = _quizSnap;
        setQuizData(_quizSnap.data());
      }
      setIsLoadingQuiz(false);
    }

    if (!quizID) return setIsLoadingQuiz(false);

    if (quizID) {
      setIsLoadingQuiz(true);
      loadQuiz(quizID);
    }
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
        </>
      )}
    </>
  );
}
