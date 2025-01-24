import { Button } from "@/components/ui/button";
import { useAuth } from "@/utils/AuthContext";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { ReactNode } from "react";
import { Link } from "wouter";

type QuizManagerLayoutProps = {
  children: ReactNode;
  title: string;
};

export function QuizManagerLayout({ children, title }: QuizManagerLayoutProps) {
  const { user, signin, signout, signinAnonymously } = useAuth();
  useDocumentTitle(title);
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/quiz/">My Quizzes</Link>
            </li>
            <li>
              <Link href="/quiz/new">Create a Quiz</Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Button onClick={signin}>Sign In</Button>
                </li>
                <li>
                  <button onClick={signinAnonymously}>
                    Sign In Anonymously
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Button onClick={signout}>Sign Out</Button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}
