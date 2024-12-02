import { QuizList } from "@/app/pages/QuizList";
import { useDeleteQuiz, useQuizzes } from "@/features/quizzes/queries";
import { useAuth } from "@/utils/AuthContext";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, it, Mock, vi } from "vitest";

vi.mock("@/features/quizzes/queries", () => ({
  useQuizzes: vi.fn(),
  useDeleteQuiz: vi.fn(),
}));

vi.mock("@/utils/AuthContext", () => ({
  useAuth: vi.fn(),
}));

it("renders loading state when quizzes are pending", () => {
  (useQuizzes as Mock).mockReturnValue({
    isPending: true,
    isError: false,
    error: null,
    data: null,
  });

  (useAuth as Mock).mockReturnValue({ user: { id: "user123" } });

  render(<QuizList />);

  expect(screen.getByText(/loading.../i)).toBeInTheDocument();
});

it("renders error state when quizzes fail to load", () => {
  (useQuizzes as Mock).mockReturnValue({
    isPending: false,
    isError: true,
    error: { message: "Failed to load quizzes" },
    data: null,
  });

  (useAuth as Mock).mockReturnValue({ user: { id: "user123" } });

  render(<QuizList />);

  expect(
    screen.getByText(/Error: Failed to load quizzes/i)
  ).toBeInTheDocument();
});

it("renders message when no quizzes are available", () => {
  (useQuizzes as Mock).mockReturnValue({
    isPending: false,
    isError: false,
    error: null,
    data: [],
  });

  (useAuth as Mock).mockReturnValue({ user: { id: "user123" } });

  render(<QuizList />);

  expect(screen.getByText(/You don't have any quizzes./i)).toBeInTheDocument();
  const createQuizLink = screen.getByRole("link", { name: /Create one!/i });
  expect(createQuizLink).toBeInTheDocument();
  expect(createQuizLink).toHaveAttribute("href", "/new");
});

it("renders quizzes when data is available", () => {
  const mockQuizID = "quiz1";

  (useQuizzes as Mock).mockReturnValue({
    isPending: false,
    isError: false,
    error: null,
    data: [
      {
        id: mockQuizID,
        title: "Quiz 1",
        description: "Description of Quiz 1",
        questions: [{ id: "q1" }, { id: "q2" }],
      },
    ],
  });

  (useAuth as Mock).mockReturnValue({ user: { id: "user123" } });

  (useDeleteQuiz as Mock).mockReturnValue({
    mutate: vi.fn(),
  });

  render(<QuizList />);

  expect(screen.getByRole("heading", { name: /Quiz 1/i })).toBeInTheDocument();
  expect(screen.getByText(/Description of Quiz 1/i)).toBeInTheDocument();
  expect(screen.getByText(/2 questions/i)).toBeInTheDocument();
  expect(screen.getByText(/Edit Quiz/i)).toBeInTheDocument();

  const hostGameLink = screen.getByRole("link", { name: /Host Game/i });
  expect(hostGameLink).toBeInTheDocument();
  // TODO: Fix, centralise, and absolutise paths
  // expect(hostGameLink).toHaveAttribute(
  //   "href",
  //   new RegExp(`host/${mockQuizID}`, "gi")
  // );

  const editQuizLink = screen.getByRole("link", { name: /Edit/i });
  expect(editQuizLink).toBeInTheDocument();

  const deleteQuizButton = screen.getByRole("button", { name: /Delete Quiz/i });
  expect(deleteQuizButton).toBeInTheDocument();
});
