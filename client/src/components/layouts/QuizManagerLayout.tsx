import { Logo } from "@/components/Logo";
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
        <nav className="h-full container px-4 mx-auto flex justify-between">
          <Link href="~/" className="h-full">
            <Logo />
          </Link>
          <ul className="flex items-center md:gap-4 -mr-2">
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
