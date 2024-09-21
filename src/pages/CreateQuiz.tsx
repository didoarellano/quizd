import { useEffect, useRef, useState } from "react";
import type { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { useLocation, useRouter } from "wouter";

import { generateID, getQuiz, saveNewQuiz, updateQuiz } from "../services/quiz";
import { useAuth } from "../contexts/AuthContext";
import { Teacher, UserRoles } from "../services/auth";
import { QuizEditor } from "../components/QuizEditor";
import { parseQuiz } from "../utils/markdown";

type CreateQuizProps = {
  quizID?: string;
};

export function CreateQuiz({ quizID }: CreateQuizProps) {
  const quizSnap = useRef<DocumentSnapshot | null>(null);
  const [quizData, setQuizData] = useState<DocumentData | null>(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(true);
  const [, setLocation] = useLocation();
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

      {isLoadingQuiz ? (
        <p>...</p>
      ) : (
        <QuizEditor
          initialMDText={quizData?._rawMD ?? ""}
          handleSave={handleSave}
        />
      )}
    </>
  );
}
