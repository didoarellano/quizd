import { QuizList } from "@/app/pages/QuizList";
import { useDeleteQuiz, useQuizzes } from "@/features/quizzes/queries";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, it, Mock, vi } from "vitest";

vi.mock("@/features/quizzes/queries", () => ({
  useQuizzes: vi.fn(),
  useDeleteQuiz: vi.fn(),
}));

vi.mock("@/utils/AuthContext", () => ({
  useAuth: vi.fn().mockReturnValue({ user: { id: "user123" } }),
}));

afterEach(() => {
  vi.clearAllMocks();
});

it("renders loading state when quizzes are pending", () => {
  (useQuizzes as Mock).mockReturnValue({
    status: "pending",
    error: null,
    data: null,
  });
  render(<QuizList />);

  expect(screen.getByText(/loading.../i)).toBeInTheDocument();
});

it("renders error state when quizzes fail to load", () => {
  (useQuizzes as Mock).mockReturnValue({
    status: "error",
    error: { message: "Failed to load quizzes" },
    data: null,
  });
  render(<QuizList />);

  expect(
    screen.getByText(/Error: Failed to load quizzes/i)
  ).toBeInTheDocument();
});

it("renders message when no quizzes are available", () => {
  (useQuizzes as Mock).mockReturnValue({
    status: "success",
    error: null,
    data: [],
  });
  render(<QuizList />);

  expect(screen.getByText(/You don't have any quizzes./i)).toBeInTheDocument();
  const createQuizLink = screen.getByRole("link", { name: /Create one!/i });
  expect(createQuizLink).toBeInTheDocument();
  expect(createQuizLink).toHaveAttribute("href", "/new");
});

it("renders quizzes when data is available", () => {
  const mockQuizID = "quiz1";

  (useQuizzes as Mock).mockReturnValue({
    status: "success",
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
  (useDeleteQuiz as Mock).mockReturnValue({
    mutate: vi.fn(),
  });

  render(<QuizList />);

  expect(screen.getByRole("heading", { name: /Quiz 1/i })).toBeInTheDocument();
  expect(screen.getByText(/Description of Quiz 1/i)).toBeInTheDocument();
  expect(screen.getByText(/2 questions/i)).toBeInTheDocument();
  expect(screen.getByText(/Edit/i)).toBeInTheDocument();

  const hostGameLink = screen.getByRole("link", { name: /Host/i });
  expect(hostGameLink).toBeInTheDocument();
  // TODO: Fix, centralise, and absolutise paths
  // expect(hostGameLink).toHaveAttribute(
  //   "href",
  //   new RegExp(`host/${mockQuizID}`, "gi")
  // );

  const editQuizLink = screen.getByRole("link", { name: /Edit/i });
  expect(editQuizLink).toBeInTheDocument();

  const deleteQuizButton = screen.getByRole("button", { name: /Delete/i });
  expect(deleteQuizButton).toBeInTheDocument();
});
