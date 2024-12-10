import {
  useDeleteQuiz,
  useQuiz,
  useSaveNewQuiz,
  useSaveQuiz,
} from "@/features/quizzes/queries";
import { UserRoles } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, Mock, vi } from "vitest";
import { QuizEditor } from "./QuizEditor";

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
  useSaveNewQuiz: vi.fn(),
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
    render(<QuizEditor mode="edit" quizID="quiz1" />);

    expect(screen.getByText("loading...")).toBeInTheDocument();
  });

  it("redirects to base path on error", () => {
    (useQuiz as Mock).mockReturnValue({
      isPending: false,
      isError: true,
      data: null,
    });
    render(<QuizEditor mode="edit" quizID="quiz1" />);

    expect(screen.getByText("Redirected to: ~")).toBeInTheDocument();
  });
});

describe("create mode", () => {
  const mockSaveNewQuiz = vi.fn();

  beforeEach(() => {
    (useSaveNewQuiz as Mock).mockImplementation(({ onSuccess }) => ({
      mutate: mockSaveNewQuiz.mockImplementation(() => {
        const mockQuizRef = { id: "randomid" };
        onSuccess(mockQuizRef);
      }),
    }));
  });

  it("renders in create mode", () => {
    render(<QuizEditor mode="create" />);

    expect(screen.getByText("Create Quiz")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls saveNewQuiz when user saves the quiz", async () => {
    render(<QuizEditor mode="create" />);

    const editor = screen.getByRole("textbox");
    fireEvent.change(editor, { target: { value: "# New Quiz" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveNewQuiz).toHaveBeenCalledWith({
        userID: "asdf",
        mdText: "# New Quiz",
      });
    });
  });

  it("redirects on saveNewQuiz success", () => {
    render(<QuizEditor mode="create" />);

    const editor = screen.getByRole("textbox");
    fireEvent.change(editor, { target: { value: "# New Quiz" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    expect(mockSetLocation).toHaveBeenCalledWith("~/randomid", {
      replace: true,
    });
  });
});

describe("edit mode", () => {
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

  it("renders in edit mode with quiz data", () => {
    render(<QuizEditor mode="edit" quizID="quiz1" />);
    expect(screen.getByText("Editing Quiz: Test Quiz")).toBeInTheDocument();
    expect(screen.getByText("Host Game")).toBeInTheDocument();
    expect(screen.getByText("Mock Delete Quiz")).toBeInTheDocument();
  });

  it("calls saveQuiz when user saves the quiz", async () => {
    render(<QuizEditor mode="edit" quizID="quiz1" />);

    const editor = screen.getByRole("textbox");
    fireEvent.change(editor, { target: { value: "# New Quiz Title" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveQuiz).toHaveBeenCalledWith("# New Quiz Title");
    });
  });

  it("calls deleteQuiz when user deletes the quiz", () => {
    render(<QuizEditor mode="edit" quizID="quiz1" />);
    const deleteButton = screen.getByText("Mock Delete Quiz");
    fireEvent.click(deleteButton);

    expect(mockDeleteQuiz).toHaveBeenCalledTimes(1);
    expect(mockDeleteQuiz).toHaveBeenCalledWith("quiz1");
  });
});
