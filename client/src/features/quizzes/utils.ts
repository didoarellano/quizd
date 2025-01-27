import { generateID } from "@/services/quiz";
import { Quiz } from "@/types/quiz";
import { parseQuiz } from "@/utils/markdown-quiz-parser";

export function validateAndParseQuiz(mdText: string): Quiz {
  let quiz = parseQuiz(generateID, mdText);
  if (!quiz.questions) {
    throw new Error("Your quiz needs at least one question");
  }
  return quiz;
}
