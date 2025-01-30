import { cn } from "@/lib/utils";
import { useDocumentTitle } from "@/utils/useDocumentTitle";
import { PropsWithChildren, ReactNode } from "react";

type GameLayoutProps = {
  title: string;
  variant?: "default" | "in-game";
  heading: ReactNode;
  mainContent: ReactNode;
};

export function GameLayout({
  variant = "default",
  title,
  heading,
  mainContent,
}: GameLayoutProps) {
  useDocumentTitle(title);
  const isDefault = variant === "default";
  return (
    <div
      className={cn(
        "h-screen py-4 px-2 flex bg-teal-600",
        isDefault && "items-center"
      )}
    >
      <div
        className={cn(
          "container mx-auto",
          isDefault && "w-full max-w-[24.5rem]"
        )}
      >
        <header
          className={cn(
            "mb-2 flex gap-4 items-center",
            isDefault ? "text-5xl" : "justify-end"
          )}
        >
          {heading}
        </header>
        <main className="grid gap-8">
          <div className="p-8 border flex flex-col gap-4 bg-white shadow-lg rounded-sm">
            {mainContent}
          </div>
        </main>
      </div>
    </div>
  );
}

function Heading({ children }: PropsWithChildren) {
  return (
    <h1 className="uppercase font-black text-white [text-shadow:_2px_2px_0_rgb(0_0_0_/_30%)]">
      {children}
    </h1>
  );
}

GameLayout.Heading = Heading;
