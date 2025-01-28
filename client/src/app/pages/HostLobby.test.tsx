import { useGameAsHost, useStartGame } from "@/features/games-as-host/queries";
import { GameStatus } from "@/types/game";
import { fireEvent, render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { useLocation } from "wouter";
import { HostLobby } from "./HostLobby";

vi.mock("@/features/games-as-host/queries", () => ({
  useGameAsHost: vi.fn(),
  useStartGame: vi.fn(),
}));

vi.mock("wouter", () => ({
  useLocation: vi.fn(),
  Link: ({ href, children, onClick }: any) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  ),
}));

const mockMutate = vi.fn();
const mockUseStartGame = {
  mutate: mockMutate,
};

beforeEach(() => {
  (useLocation as Mock).mockReturnValue(["/host/123", vi.fn()]);
  (useStartGame as Mock).mockReturnValue(mockUseStartGame);
});

afterEach(() => {
  vi.resetAllMocks();
});

function createTestGame(status: string) {
  return {
    data: {
      quiz: {
        title: "Test Quiz",
        description: "This is a test quiz.",
      },
      status,
      pin: "1234",
      players: [
        { id: "p1", displayName: "Rubber" },
        { id: "p2", displayName: "Dork" },
      ],
    },
  };
}

it("renders the host lobby with game details", () => {
  (useGameAsHost as Mock).mockReturnValue(createTestGame(GameStatus.PENDING));
  render(<HostLobby quizID="q1" />);

  expect(screen.getByText("Test Quiz")).toBeInTheDocument();
  expect(screen.getByText("This is a test quiz.")).toBeInTheDocument();
  expect(
    screen.getByText(
      (content, element) =>
        !!(
          /Enter PIN code:/i.test(content) &&
          element?.textContent?.includes("1234")
        )
    )
  ).toBeInTheDocument();
  expect(screen.getByText("Rubber")).toBeInTheDocument();
  expect(screen.getByText("Dork")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Start Game" })).toBeInTheDocument();
});

it("calls startGame.mutate when Start Game is clicked", () => {
  (useGameAsHost as Mock).mockReturnValue(createTestGame(GameStatus.PENDING));
  render(<HostLobby quizID="q1" />);
  const startGameLink = screen.getByRole("link", { name: "Start Game" });
  fireEvent.click(startGameLink);

  expect(mockMutate).toHaveBeenCalledTimes(1);
});

it("renders the correct button text based on game status", () => {
  (useGameAsHost as Mock).mockReturnValue(createTestGame(GameStatus.ONGOING));
  render(<HostLobby quizID="q1" />);

  expect(
    screen.getByRole("link", { name: "Continue Game" })
  ).toBeInTheDocument();
});
