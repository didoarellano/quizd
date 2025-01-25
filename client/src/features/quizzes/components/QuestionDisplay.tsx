import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";
import { Option, Question } from "@/types/quiz";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useRef,
} from "react";

type QuestionDisplayContextType = {
  bodyID: RefObject<string>;
};

const QuestionDisplayContext = createContext<QuestionDisplayContextType | null>(
  null
);

type QuestionDisplayProps = {
  className?: string;
  question: Question;
};

export function QuestionDisplay({
  className,
  question,
  ...props
}: PropsWithChildren<QuestionDisplayProps>) {
  const bodyID = useRef<string>(`question-body-${question.id}`);

  return (
    <QuestionDisplayContext.Provider value={{ bodyID }}>
      <fieldset {...(question.body && { "aria-describedby": bodyID.current })}>
        {/* grid/flex on fieldset still wonky */}
        <div className={cn("grid gap-4", className)} {...props} />
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
    <legend className={cn("text-xl font-bold", className)}>
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

  // useRef initialises .current to null
  // HTML attribute values can't be null but can be undefined
  const bodyID = context.bodyID.current || undefined;

  return (
    <div
      id={bodyID}
      className={cn(
        "grid gap-2 [&_pre]:bg-slate-50 [&_pre]:p-4 [&_pre]:border [&_pre]:rounded-sm",
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
};

function Options({
  className,
  questionID,
  options,
  onOptionChange,
  activeOptionID,
}: OptionsProps) {
  function handleChange(optionID: string) {
    onOptionChange && onOptionChange(questionID, optionID);
  }

  return (
    <ol className={cn("grid gap-2", className)}>
      {options.map((option) => (
        <li key={option.id} className="border">
          <label
            className={cn(
              "block py-4 px-6 cursor-pointer",
              activeOptionID === option.id && "bg-amber-50"
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
