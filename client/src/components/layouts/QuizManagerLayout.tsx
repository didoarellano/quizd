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
      <header className="h-[4rem] p-4 border-b">
        <nav className="container mx-auto flex justify-end">
          <ul className="flex items-center md:gap-4">
            <li>
              <Button variant="ghost" size="sm" asChild={true}>
                <Link href="/">My Quizzes</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm" asChild={true}>
                <Link href="/new">Create a Quiz</Link>
              </Button>
            </li>
            {!user ? (
              <>
                <li>
                  <Button size="sm" onClick={signin}>
                    Sign In
                  </Button>
                </li>
                <li>
                  <button onClick={signinAnonymously}>
                    Sign In Anonymously
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Button variant="ghost" size="sm" onClick={signout}>
                  Sign Out
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      <main className="container px-4 mx-auto">{children}</main>
    </>
  );
}
