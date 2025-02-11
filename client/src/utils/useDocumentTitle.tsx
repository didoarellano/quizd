import { useEffect } from "react";

const BASE_TITLE = "QuizD";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    title = !title ? "" : `${title} |`;
    document.title = `${title} ${BASE_TITLE}`;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
}
