import { BackButton } from "@/components/BackButton";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { ReactNode } from "react";

type QuizEditorLayoutProps = {
  title: string;
  heading: ReactNode;
  actionBarItems: ReactNode;
  editor: ReactNode;
  preview?: ReactNode;
};

export function QuizEditorLayout({
  title,
  heading,
  actionBarItems,
  editor,
  preview,
}: QuizEditorLayoutProps) {
  useDocumentTitle(title);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="md:h-[4rem] p-4 border-b">
        <div className="h-full container mx-auto grid grid-cols-[auto_1fr_auto] gap-2 md:grid-cols-[1fr_2fr_1fr] items-center justify-between">
          <BackButton />
          <h1 className="text-2xl/normal font-bold text-left md:text-center truncate">
            {heading}
          </h1>
          <div className="flex gap-2 items-center justify-end">
            {actionBarItems}
          </div>
        </div>
      </header>

      <main
        className={`h-[calc(100vh-4rem)] container mx-auto ${
          !preview ? "md:grid" : "grid"
        } md:grid-cols-2 gap-4`}
      >
        <section className="h-full p-2 md:overflow-auto bg-slate-50">
          {editor}
        </section>
        {preview && (
          <section className="h-full py-4 md:overflow-auto px-2">
            {preview}
          </section>
        )}
      </main>
    </div>
  );
}
