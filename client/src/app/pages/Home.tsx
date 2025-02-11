import { demoMDText, demoQuiz } from "@/assets/home-content/demo-quiz";
import { features } from "@/assets/home-content/feature-list";
import { plans } from "@/assets/home-content/plans";
import { GetNotifiedForm } from "@/components/GetNotifiedForm";
import { Logo } from "@/components/Logo";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { QuizPreview } from "@/features/quizzes/components/QuizPreview";
import { QuizSaveButton } from "@/features/quizzes/components/QuizSaveButton";
import { validateAndParseQuiz } from "@/features/quizzes/utils";
import { Quiz } from "@/types/quiz";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function Home() {
  const [quiz, setQuiz] = useState<Partial<Quiz>>(demoQuiz);
  useDocumentTitle("Create Interactive Quizzes with Markdown");

  return (
    <>
      <header className="h-[4rem] bg-teal-600/90 text-slate-50">
        <div className="h-full container p-4 mx-auto flex items-center justify-between">
          <Link href="~/" className="h-full">
            <Logo className="text-slate-50" />
          </Link>
          <nav className="flex justify-end">
            <ul className="flex md:gap-4">
              <li>
                <Button variant="ghost" size="sm" asChild={true}>
                  <a href="#features">Features</a>
                </Button>
              </li>
              <li>
                <Button variant="ghost" size="sm" asChild={true}>
                  <a href="#pricing">Pricing</a>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-12 md:py-20 grid gap-4 bg-teal-600 text-slate-50">
          <div className="container p-4 mx-auto">
            <div className="max-w-screen-md mx-auto">
              <h1 className="mb-4 text-3xl sm:text-6xl font-bold">
                Create Interactive Quizzes with Markdown
              </h1>
              <p className="mb-4 sm:text-xl text-slate-200">
                Ditch the drag-and-drop. Transform your Markdown files into
                engaging quizzes. Import from GitHub or write in the editor,
                host live quizzes with real-time feedback, and foster a safe
                learning space where students can participate anonymously.
              </p>

              <GetNotifiedForm />
            </div>
          </div>
        </section>

        <section className="hidden md:block bg-[linear-gradient(to_bottom,#0d9488_50%,#f5f5f5_50%)]">
          <div className="container px-4 md:px-0 mx-auto grid bg-white shadow-lg rounded-sm relative">
            <div className="p-2 border-b">
              <div className="h-full container mx-auto grid grid-cols-[auto_1fr_auto] gap-2 md:grid-cols-[1fr_2fr_1fr] items-center justify-between">
                <span></span>
                <h2 className="text-2xl/normal font-bold md:text-center truncate">
                  {quiz.title}
                </h2>
                <div className="flex gap-2 items-center justify-end">
                  <QuizSaveButton formID="demo-markdown-editor" />
                </div>
              </div>
            </div>
            <div className="max-h-[42rem] grid grid-cols-2 gap-2">
              <div className="h-full px-2 bg-slate-50 overflow-auto">
                <MarkdownEditor
                  formID="demo-markdown-editor"
                  hideSaveButton={true}
                  initialMDText={demoMDText}
                  autoFocus={false}
                  handleSave={(mdText: string) => {
                    try {
                      const q = validateAndParseQuiz(mdText);
                      setQuiz(q);
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                />
              </div>
              <div className="h-full py-4 px-2 overflow-auto">
                <QuizPreview quiz={quiz as Quiz} />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-gray-100" id="features">
          <div className="container p-4 mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h2 id="features" className="text-3xl md:text-4xl font-bold">
                Features
              </h2>
              <p className="text-gray-500">
                Everything you need to create and manage interactive quizzes
                with ease
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {features.map(({ heading, body, Icon }) => (
                <Card key={heading}>
                  <CardContent className="p-6 flex flex-col gap-2 items-center">
                    <Icon className="h-12 w-12" />
                    <h3 className="text-xl font-bold">{heading}</h3>
                    <p className="text-sm text-center text-gray-500">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-white" id="pricing">
          <div className="container p-4 mx-auto space-y-4">
            <div className="text-center space-y-2">
              <h2 id="pricing" className="text-3xl md:text-4xl font-bold">
                Simple, Transparent Pricing
              </h2>
              <p className="text-gray-500">
                Choose the plan that's right for you
              </p>
            </div>
            <div className="grid md:grid-cols-3 auto-rows-[1fr] gap-4">
              {plans.map((p) => (
                <Card
                  key={p.title}
                  className={`flex flex-col gap-2 justify-between bg-gray-100 ${
                    p.justRight
                      ? "scale-105 border-2 border-primary shadow-lg"
                      : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">{p.title}</h3>
                    <p className="mb-6 text-4xl font-bold">{p.price}</p>
                    <ul className="space-y-2">
                      {p.inclusions.map((text) => (
                        <li key={text} className="flex items-center">
                          <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                          {text}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild={true}>
                      <a href={p.button.link}>{p.button.text}</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20 bg-teal-600 text-slate-50">
          <div className="container p-4 mx-auto grid gap-4">
            <div className="space-y-2 text-center">
              <h2
                id="features"
                className="text-3xl font-bold tracking-tighter md:text-4xl"
              >
                Ready to Create Your First Quiz?
              </h2>
              <p className="sm:text-xl text-slate-200">
                Sign up now to get early access and be the first to know when we
                launch!
              </p>
            </div>

            <GetNotifiedForm className="flex justify-center [&_#notification-description]:sr-only" />
          </div>
        </section>
      </main>
    </>
  );
}
