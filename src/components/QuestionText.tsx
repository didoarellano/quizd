import { Markdown } from "./Markdown";

type QuestionTextProps = {
  heading: string;
  body?: string;
};

export function QuestionText({ heading, body }: QuestionTextProps) {
  return (
    <>
      <Markdown>{heading}</Markdown>
      {body && <Markdown>{body}</Markdown>}
    </>
  );
}
