import type { Teacher } from "./auth";

type Option = {
  id: string;
  text: string;
};

const QuestionTypes = {
  Multi: "multiple-choice",
  Text: "text",
} as const;

type QuestionTypeKeys = (typeof QuestionTypes)[keyof typeof QuestionTypes];

type Question = {
  id: string;
  type: QuestionTypeKeys;
  heading: string;
  body: string;
  options: Option[];
  answers: Option["id"][];
};

type Quiz = {
  id?: string;
  teacherID: Teacher["id"];
  title: string;
  description?: string;
  questions: Question[];
};
