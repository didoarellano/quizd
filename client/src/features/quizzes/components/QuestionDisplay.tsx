import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";
import { Answer, Option, Question } from "@/types/quiz";
import { createContext, PropsWithChildren, useContext } from "react";

type QuestionDisplayContextType = {
  bodyID: string;
};

const QuestionDisplayContext = createContext<QuestionDisplayContextType | null>(
  null
);

type Size = "normal" | "xl";

type QuestionDisplayProps = {
  size?: Size;
  className?: string;
  question: Question;
};

export function QuestionDisplay({
  size = "normal",
  className,
  question,
  ...props
}: PropsWithChildren<QuestionDisplayProps>) {
  const bodyID = `question-body-${question.id}`;
  const textSize = size === "normal" ? "text-base" : "text-4xl";
  return (
    <QuestionDisplayContext.Provider value={{ bodyID }}>
      <fieldset {...(question.body && { "aria-describedby": bodyID })}>
        {/* grid/flex on fieldset still wonky */}
        <div className={cn("grid gap-[1em]", textSize, className)} {...props} />
      </fieldset>
    </QuestionDisplayContext.Provider>
  );
}

type CommonTextProps = {
  children: string;
  className?: string;
};

function Heading({ children, className = "" }: CommonTextProps) {
  return (
    <legend className={cn("text-[1.5em] leading-none font-black", className)}>
      <Markdown disallowedElements={["p"]} unwrapDisallowed={true}>
        {children}
      </Markdown>
    </legend>
  );
}

function Body({ children, className = "" }: CommonTextProps) {
  const context = useContext(QuestionDisplayContext);

  if (!context) {
    throw new Error("QuestionDisplay.Body must be a child of QuestionDisplay");
  }

  return (
    <div
      id={context.bodyID}
      className={cn(
        "grid gap-[0.5em] [&_pre]:bg-slate-50 [&_pre]:p-[1em] [&_pre]:border [&_pre]:rounded-sm",
        className
      )}
    >
      <Markdown>{children}</Markdown>
    </div>
  );
}

type OptionsProps = {
  className?: string;
  questionID: string;
  options: Option[];
  onOptionChange?: (questionID: string, answerID: string) => void;
  activeOptionID?: string;
  answerKey?: Answer[];
};

function Options({
  className,
  questionID,
  options,
  onOptionChange,
  activeOptionID,
  answerKey,
}: OptionsProps) {
  function handleChange(optionID: string) {
    onOptionChange && onOptionChange(questionID, optionID);
  }

  return (
    <ol className={cn("grid gap-[0.5em]", className)}>
      {options.map((option) => (
        <li key={option.id} className="border">
          <label
            className={cn(
              "block p-[1em] cursor-pointer",
              activeOptionID === option.id && "bg-amber-50",
              answerKey && answerKey.includes(option.id) && "bg-green-50"
            )}
          >
            <Markdown disallowedElements={["p"]} unwrapDisallowed={true}>
              {option.text}
            </Markdown>
            <input
              type="radio"
              name={questionID}
              className="hidden"
              onChange={() => handleChange(option.id)}
            />
          </label>
        </li>
      ))}
    </ol>
  );
}

QuestionDisplay.Heading = Heading;
QuestionDisplay.Body = Body;
QuestionDisplay.Options = Options;
