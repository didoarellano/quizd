import { PlayerGameScreen } from "@/app/pages/PlayerGameScreen";
import {
  useGameAsPlayer,
  useSaveAnswerMutation,
} from "@/features/games-as-player/queries";
import { GameStatus } from "@/types/game";
import { useAuth } from "@/utils/AuthContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";

const mockSetLocation = vi.fn();
vi.mock("wouter", async (importOriginal) => {
  const actual = await importOriginal<typeof import("wouter")>();
  return {
    ...actual,
    useLocation: () => [null, mockSetLocation],
    Redirect: vi.fn(({ to }: { to: string }) => <div>Redirected to: {to}</div>),
  };
});

vi.mock("@/utils/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/features/games-as-player/queries", () => ({
  useGameAsPlayer: vi.fn(),
  useSaveAnswerMutation: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

function createTestGame({
  status = GameStatus.ONGOING,
  currentQuestionIndex = 0,
  currentQuestionAnswer = null,
  playerAnswers = { q1: "o1" },
  leaderboard,
}: {
  status?: string;
  currentQuestionIndex?: number;
  currentQuestionAnswer?: string[] | null;
  playerAnswers?: {};
  leaderboard?: {};
} = {}) {
  return {
    gameID: "g1",
    quiz: {
      title: "Sample Quiz",
      questions: [
        {
          id: "q1",
          heading: "What is 2 + 2?",
          options: [
            { id: "o1", text: "3" },
            { id: "o2", text: "4" },
          ],
        },
      ],
    },
    answers: playerAnswers,
    activeGameChannel: {
      status,
      currentQuestionIndex,
      currentQuestionAnswer,
      leaderboard,
    },
  };
}

it("renders loading state when data is pending", () => {
  (useAuth as Mock).mockReturnValue({
    user: { id: "p1", displayName: "rubberdork" },
  });
  (useGameAsPlayer as Mock).mockReturnValue({
    data: createTestGame(),
    isPending: true,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(screen.getByText("...")).toBeInTheDocument();
});

it("redirects if game is not found", () => {
  (useGameAsPlayer as Mock).mockReturnValue({
    data: null,
    isPending: false,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(screen.getByText("Redirected to: ~")).toBeInTheDocument();
});

it("redirects if user is not authenticated", () => {
  (useAuth as Mock).mockReturnValue({ user: null });
  (useGameAsPlayer as Mock).mockReturnValue({
    data: createTestGame(),
    isPending: false,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(screen.getByText("Redirected to: ~")).toBeInTheDocument();
});

it("renders waiting screen if game is in pending state", () => {
  (useAuth as Mock).mockReturnValue({
    user: { id: "p1", displayName: "rubberdork" },
  });
  (useGameAsPlayer as Mock).mockReturnValue({
    data: createTestGame({ status: GameStatus.PENDING }),
    isPending: false,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(screen.getByText(/Welcome rubberdork/i)).toBeInTheDocument();
  expect(
    screen.getByText(/waiting for host to start the game/i)
  ).toBeInTheDocument();
});

it("uses the child component to render the current question", () => {
  const mockData = createTestGame();
  (useGameAsPlayer as Mock).mockReturnValue({
    data: mockData,
    isPending: false,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(
    screen.getByText(mockData.quiz.questions[0].heading)
  ).toBeInTheDocument();
});

it("calls saveAnswer on option click", () => {
  const mockData = createTestGame();
  (useGameAsPlayer as Mock).mockReturnValue({
    data: mockData,
    isPending: false,
  });
  const mockSaveAnswer = vi.fn();
  (useSaveAnswerMutation as Mock).mockReturnValue({
    mutate: mockSaveAnswer,
  });
  render(<PlayerGameScreen pin="123456" />);

  const optionButton = screen.getByText(
    mockData.quiz.questions[0].options[1].text
  );
  fireEvent.click(optionButton);

  expect(mockSaveAnswer).toHaveBeenCalledWith({
    questionID: "q1",
    answerID: "o2",
  });
});

it("renders round results when question is closed and answer is correct", () => {
  (useGameAsPlayer as Mock).mockReturnValue({
    data: createTestGame({
      currentQuestionIndex: 0,
      currentQuestionAnswer: ["o2"],
      playerAnswers: { q1: "o2" },
    }),
    isPending: false,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(screen.getByText("Correct answer(s):")).toBeInTheDocument();
  expect(screen.getByText("Your answer")).toBeInTheDocument();
  expect(screen.getByText("is correct")).toBeInTheDocument();
});

it("renders round results when question is closed and answer is incorrect", () => {
  (useGameAsPlayer as Mock).mockReturnValue({
    data: createTestGame({
      currentQuestionIndex: 0,
      currentQuestionAnswer: ["o2"],
      playerAnswers: { q1: "o1" },
    }),
    isPending: false,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(screen.getByText("Correct answer(s):")).toBeInTheDocument();
  expect(screen.getByText("Your answer")).toBeInTheDocument();
  expect(screen.getByText("is incorrect")).toBeInTheDocument();
});

it("renders final leaderboard when game is completed", () => {
  (useGameAsPlayer as Mock).mockReturnValue({
    data: createTestGame({
      status: GameStatus.COMPLETED,
      leaderboard: [{ id: "p1", displayName: "rubberdork", score: 10 }],
    }),
    isPending: false,
  });
  render(<PlayerGameScreen pin="123456" />);

  expect(screen.getByText("Results")).toBeInTheDocument();
  expect(screen.getByText("You scored 10 points")).toBeInTheDocument();
});
