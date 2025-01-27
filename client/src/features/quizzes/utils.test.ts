import { validateAndParseQuiz } from "@/features/quizzes/utils";
import { generateID } from "@/services/quiz";
import { parseQuiz } from "@/utils/markdown-quiz-parser";
import { expect, it, vi } from "vitest";

vi.mock("@/services/quiz", () => ({
  generateID: vi.fn(() => "mock-id"),
}));

vi.mock("@/utils/markdown-quiz-parser", () => ({
  parseQuiz: vi.fn((generateID, mdText) => {
    if (mdText === "") return;
    return {
      id: generateID(),
      title: "Mock Quiz",
      questions: [{ id: "q1", text: "Sample Question" }],
    };
  }),
}));

it("should throw if quiz has no questions", () => {
  expect(() => validateAndParseQuiz("")).toThrow();
});

it("should return a valid quiz", () => {
  const mdText = "Mock Quiz";
  const quiz = validateAndParseQuiz(mdText);
  expect(parseQuiz).toHaveBeenCalledWith(generateID, mdText);
  expect(generateID).toHaveBeenCalled();
  expect(quiz).toEqual({
    id: "mock-id",
    title: "Mock Quiz",
    questions: [{ id: "q1", text: "Sample Question" }],
  });
});
