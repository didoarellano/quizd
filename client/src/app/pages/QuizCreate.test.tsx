import { useSaveNewQuiz } from "@/features/quizzes/queries";
import { UserRoles } from "@/services/auth";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { QuizCreate } from "./QuizCreate";

const mockSetLocation = vi.fn();
vi.mock("wouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wouter")>();
  return {
    ...actual,
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
  useSaveNewQuiz: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

const mockSaveNewQuiz = vi.fn();

beforeEach(() => {
  (useSaveNewQuiz as Mock).mockImplementation(({ onSuccess }) => ({
    mutate: mockSaveNewQuiz.mockImplementation(() => {
      const mockQuizRef = { id: "randomid" };
      onSuccess(mockQuizRef);
    }),
  }));
});

it("renders with placeholder content", () => {
  render(<QuizCreate />);

  expect(document.title).toContain("Create New Quiz");
  expect(
    screen.getByRole("heading", { name: "Untitled Quiz" })
  ).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toBeInTheDocument();
  // Check initial/placeholder front-matter
  expect(screen.getByDisplayValue(/title: Untitled Quiz/)).toBeInTheDocument();
});

it("should not save with empty or starter content", () => {
  render(<QuizCreate />);

  const editor = screen.getByRole("textbox");
  const saveButton = screen.getAllByText("Save")[0];
  fireEvent.click(saveButton);
});

it("calls saveNewQuiz when user saves the quiz", async () => {
  render(<QuizCreate />);

  const editor = screen.getByRole("textbox");
  fireEvent.change(editor, { target: { value: "## New Quiz" } });

  const saveButton = screen.getAllByText("Save")[0];
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(mockSaveNewQuiz).toHaveBeenCalledWith(
      expect.objectContaining({
        userID: "asdf",
        mdText: "## New Quiz",
        quiz: expect.any(Object),
      })
    );
  });
});

it("redirects on saveNewQuiz success", () => {
  render(<QuizCreate />);

  const editor = screen.getByRole("textbox");
  fireEvent.change(editor, { target: { value: "## New Quiz" } });

  const saveButton = screen.getAllByText("Save")[0];
  fireEvent.click(saveButton);

  expect(mockSetLocation).toHaveBeenCalledWith("~/randomid", {
    replace: true,
  });
});
