import { QuizDisplay } from "@/components/QuizDisplay";
import { Quiz } from "@/types/quiz";
import type { CSSProperties, PropsWithChildren } from "react";
import { useMemo } from "react";
import { Link, useLocation, useSearch } from "wouter";

type CycleLinkProps = {
  href: string;
  disabled: boolean;
};

function CycleLink({
  href,
  disabled,
  children,
}: PropsWithChildren<CycleLinkProps>) {
  const style: CSSProperties = disabled ? { pointerEvents: "none" } : {};
  return (
    <Link href={href} style={style}>
      {children}
    </Link>
  );
}

export function QuizPreview({ quiz }: { quiz: Quiz }) {
  const [location] = useLocation();
  const searchParams = useSearch();
  const showPreview = !!searchParams;

  const questionIndex = useMemo(() => {
    const qs = Object.fromEntries(new URLSearchParams(searchParams));
    return Number(qs.previewQ);
  }, [searchParams]);

  const atFirst = questionIndex === 0;
  const atLast = questionIndex === quiz.questions.length - 1;

  return (
    <div>
      <h3>Preview</h3>

      <Link href={`${location}${showPreview ? "" : "?previewQ=0"}`}>
        {showPreview ? "Hide" : "Show"} Preview
      </Link>

      {showPreview && (
        <>
          <CycleLink
            href={atFirst ? "#" : `${location}?previewQ=${questionIndex - 1}`}
            disabled={atFirst}
          >
            Prev
          </CycleLink>

          <CycleLink
            href={atLast ? "#" : `${location}?previewQ=${questionIndex + 1}`}
            disabled={atLast}
          >
            Next
          </CycleLink>

          <QuizDisplay quiz={quiz} questionIndex={questionIndex} />
        </>
      )}
    </div>
  );
}
