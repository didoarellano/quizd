import {
  useDeleteQuiz,
  useQuiz,
  useSaveQuiz,
} from "@/features/quizzes/queries";
import { UserRoles } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, Mock, vi } from "vitest";
import { QuizEdit } from "./QuizEdit";

const mockSetLocation = vi.fn();
vi.mock("wouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wouter")>();
  return {
    ...actual,
    Redirect: vi.fn(({ to }: { to: string }) => <div>Redirected to: {to}</div>),
    useLocation: vi.fn(() => ["/", mockSetLocation]),
    useRouter: vi.fn(() => ({ base: "" })),
  };
});

vi.mock("@/utils/AuthContext", () => ({
  useAuth: vi
    .fn()
    .mockReturnValue({ user: { id: "asdf", role: UserRoles.Host } }),
}));

vi.mock("@/features/quizzes/queries", () => ({
  useQuiz: vi.fn(),
  useSaveQuiz: vi.fn(),
  useDeleteQuiz: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("pending and error states", () => {
  it("shows loading state when quiz data is pending", () => {
    (useQuiz as Mock).mockReturnValue({
      isPending: true,
      isError: false,
      data: null,
    });
    render(<QuizEdit quizID="quiz1" />);

    expect(screen.getAllByText("loading...")[0]).toBeInTheDocument();
  });

  it("redirects to base path on error", () => {
    (useQuiz as Mock).mockReturnValue({
      isPending: false,
      isError: true,
      data: null,
    });
    render(<QuizEdit quizID="quiz1" />);

    expect(screen.getByText("Redirected to: ~")).toBeInTheDocument();
  });
});

describe("editing", () => {
  // Mock the 2-stage delete button which is tested on its own.
  // QuizEditor test only cares that it renders a delete button
  // with a delete callback.
  vi.mock("@/features/quizzes/components/QuizDeleteButton", () => ({
    QuizDeleteButton: ({ onDeleteClick }: { onDeleteClick: () => void }) => (
      <button onClick={onDeleteClick}>Mock Delete Quiz</button>
    ),
  }));

  const mockSaveQuiz = vi.fn();
  const mockDeleteQuiz = vi.fn();

  beforeEach(() => {
    (useQuiz as Mock).mockReturnValue({
      isPending: false,
      isError: false,
      data: {
        quiz: { title: "Test Quiz", _rawMD: "# Test Quiz", questions: [] },
        docSnap: { ref: "quizRef" },
      },
    });
    (useSaveQuiz as Mock).mockReturnValue({
      mutate: mockSaveQuiz,
    });
    (useDeleteQuiz as Mock).mockReturnValue({
      mutate: mockDeleteQuiz,
    });
  });

  it("renders with quiz data", () => {
    render(<QuizEdit quizID="quiz1" />);
    expect(
      screen.getByRole("heading", { name: "Test Quiz" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Host/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Mock Delete Quiz/i })
    ).toBeInTheDocument();
  });

  it("calls saveQuiz when user saves the quiz", async () => {
    render(<QuizEdit quizID="quiz1" />);

    const editor = screen.getByRole("textbox");
    fireEvent.change(editor, { target: { value: "# New Quiz Title" } });

    const saveButton = screen.getAllByText("Save")[0];
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveQuiz).toHaveBeenCalledWith("# New Quiz Title");
    });
  });

  it("calls deleteQuiz when user deletes the quiz", () => {
    render(<QuizEdit quizID="quiz1" />);
    const deleteButton = screen.getByText("Mock Delete Quiz");
    fireEvent.click(deleteButton);

    expect(mockDeleteQuiz).toHaveBeenCalledTimes(1);
    expect(mockDeleteQuiz).toHaveBeenCalledWith("quiz1");
  });
});
