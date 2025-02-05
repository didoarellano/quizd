import { parseQuiz } from "@/utils/markdown-quiz-parser";
import { expect, it } from "vitest";

const mockGenerateID = vi
  .fn()
  .mockReturnValueOnce("q1")
  .mockReturnValueOnce("a11")
  .mockReturnValueOnce("a12")
  .mockReturnValueOnce("q2")
  .mockReturnValueOnce("a21")
  .mockReturnValueOnce("a22")
  .mockReturnValueOnce("a23");

it("parses a markdown string into a Quiz object", () => {
  const markdown = `---
title: Sample Quiz
description: This is a sample quiz description
---

## Question 1
This is the body of question 1.

- [ ] Option 1
- [x] Option 2

## Question 2
This is the body of question 2.

- [x] Option A
- [x] Option B
- [ ] Option C
`;

  const quiz = parseQuiz(mockGenerateID, markdown);
  expect(quiz).toEqual({
    title: "Sample Quiz",
    description: "This is a sample quiz description",
    questions: [
      {
        id: "q1",
        heading: "Question 1\n",
        body: "This is the body of question 1.\n",
        options: [
          { id: "a11", text: "Option 1\n" },
          { id: "a12", text: "Option 2\n" },
        ],
        answers: ["a12"],
      },
      {
        id: "q2",
        heading: "Question 2\n",
        body: "This is the body of question 2.\n",
        options: [
          { id: "a21", text: "Option A\n" },
          { id: "a22", text: "Option B\n" },
          { id: "a23", text: "Option C\n" },
        ],
        answers: ["a21", "a22"],
      },
    ],
  });

  // One for each question (2) and answer (5)
  expect(mockGenerateID).toHaveBeenCalledTimes(7);
});

it("parses duration from question heading", () => {
  const markdown = `
## Question 1 {- 30s}
30 second duration.

- [ ] Option 1

## Question 2 {- 2m}
120 second duration.

- [ ] Option 1

## Question 3
No duration.

- [ ] Option 1
`;

  const { questions } = parseQuiz(mockGenerateID, markdown);
  expect(questions[0].duration).toEqual(30);
  expect(questions[1].duration).toEqual(120);
  expect(questions[2].duration).toBeUndefined;
});
