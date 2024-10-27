export type Option = {
  id: string;
  text: string;
};

export type Answer = Option["id"];

export const QuestionTypes = {
  Multi: "multiple-choice",
  Text: "text",
} as const;

type QuestionTypeKeys = (typeof QuestionTypes)[keyof typeof QuestionTypes];

export type Question = {
  id: string;
  type?: QuestionTypeKeys;
  heading: string;
  body: string;
  options: Option[];
  answers?: Option["id"][];
};

export type Quiz = {
  id?: string;
  _rawMD: string;
  teacherID: string;
  title: string;
  description?: string;
  questions: Question[];
};
