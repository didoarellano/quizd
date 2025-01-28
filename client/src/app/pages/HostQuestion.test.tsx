import {
  useEndGame,
  useGameAsHost,
  useQuestionRoundMutations,
} from "@/features/games-as-host/queries";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { useLocation, useSearch } from "wouter";
import { HostQuestion } from "./HostQuestion";

vi.mock("wouter", () => ({
  useLocation: vi.fn(),
  useSearch: vi.fn(),
  Link: ({ href, children }: any) => <a href={href}>{children}</a>,
}));

vi.mock("@/features/games-as-host/queries", () => ({
  useEndGame: vi.fn(),
  useGameAsHost: vi.fn(),
  useQuestionRoundMutations: vi.fn(),
}));

function createTestGame(currentQuestionIndex: number) {
  return {
    data: {
      quiz: {
        questions: [
          {
            id: "q1",
            heading: "Question 1",
            body: "Q1 body",
            options: [{ id: "q1o1", text: "Question 1 Option 1" }],
          },
          {
            id: "q2",
            heading: "Question 2",
            body: "Q2 body",
            options: [{ id: "q2o1", text: "Question 2 Option 1" }],
          },
        ],
      },
      activeGameChannel: { currentQuestionIndex },
      answerKey: {},
      players: [],
    },
  };
}

const mockCloseCurrentRound = vi.fn();
const mockStartNewRound = vi.fn();
const mockEndGame = vi.fn();
const mockSetLocation = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

describe("current question view", () => {
  beforeEach(() => {
    (useGameAsHost as Mock).mockReturnValue(createTestGame(0));
    (useLocation as Mock).mockReturnValue(["/quiz/123/play", mockSetLocation]);
    (useQuestionRoundMutations as Mock).mockImplementation((opts) => ({
      startNewRound: {
        mutate: mockStartNewRound.mockImplementation(() => {
          opts.onStartNewRound();
        }),
      },

      closeCurrentRound: {
        mutate: mockCloseCurrentRound.mockImplementation(() => {
          opts.onCloseRound();
        }),
      },
    }));
    (useEndGame as Mock).mockReturnValue({
      mutate: mockEndGame,
    });
  });

  it("renders the current question", () => {
    render(<HostQuestion quizID="123" />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
  });

  it("closes the current round when 'Close Question' is clicked", () => {
    render(<HostQuestion quizID="123" />);
    const closeButton = screen.getByRole("button", { name: /Close Question/i });
    fireEvent.click(closeButton);

    expect(mockCloseCurrentRound).toHaveBeenCalledWith("q1");
    expect(mockCloseCurrentRound).toHaveBeenCalledTimes(1);
  });

  it("navigates to the question results view when 'Close Question' is clicked", async () => {
    render(<HostQuestion quizID="123" />);
    const closeButton = screen.getByRole("button", { name: /Close Question/i });
    fireEvent.click(closeButton);

    expect(mockSetLocation).toHaveBeenCalledWith("/quiz/123/play?view=results");
  });
});

describe("results view", () => {
  beforeEach(() => {
    (useSearch as Mock).mockReturnValue("?view=results");
    (useGameAsHost as Mock).mockReturnValue(createTestGame(0));
  });

  it("only shows a Next Question button if there's a next question", () => {
    render(<HostQuestion quizID="123" />);

    const nextQuestionButton = screen.getByRole("button", {
      name: /Next Question/i,
    });
    expect(nextQuestionButton).toBeInTheDocument();
  });

  it("starts the next round when 'Next Question' is clicked", () => {
    render(<HostQuestion quizID="123" />);

    const nextButton = screen.getByRole("button", { name: /Next Question/i });
    fireEvent.click(nextButton);

    expect(mockStartNewRound).toHaveBeenCalledWith(1);
    expect(mockStartNewRound).toHaveBeenCalledTimes(1);
    expect(mockSetLocation).toHaveBeenCalledWith("/quiz/123/play");
  });

  it("only shows an End Game button if at last question", () => {
    (useGameAsHost as Mock).mockReturnValue(createTestGame(1));
    render(<HostQuestion quizID="123" />);

    const endGameButton = screen.getByRole("button", {
      name: /End Game/i,
    });
    const nextQuestionButton = screen.queryByRole("button", {
      name: /Next Question/i,
    });
    expect(endGameButton).toBeInTheDocument();
    expect(nextQuestionButton).not.toBeInTheDocument();
  });

  it("ends the game when 'End Game' is clicked on the last question", () => {
    (useGameAsHost as Mock).mockReturnValue(createTestGame(1));
    render(<HostQuestion quizID="123" />);

    const endGameButton = screen.getByRole("button", {
      name: /End Game/i,
    });
    fireEvent.click(endGameButton);
    expect(mockEndGame).toHaveBeenCalledWith("123");
  });
});
