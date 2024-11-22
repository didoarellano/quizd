import { Question } from "../../../../src/types/quiz";

type SplitResult = {
  questions: Omit<Question, "answers">[];
  answerKey: { [questionID: string]: string[] };
};

export function splitQuestionsAndAnswerKey(questions: Question[]): SplitResult {
  return questions.reduce<SplitResult>(
    (result, question) => {
      const { answers, ...questionWithoutAnswers } = question;
      result.questions.push(questionWithoutAnswers);
      if (answers) result.answerKey[question.id] = answers;
      return result;
    },
    { questions: [], answerKey: {} }
  );
}
