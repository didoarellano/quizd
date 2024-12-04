import { GameResults } from "@/app/pages/GameResults";
import { useGameResults } from "@/features/games-as-host/queries";
import { render, screen, within } from "@testing-library/react";
import { Mock, vi } from "vitest";

vi.mock("@/features/games-as-host/queries", () => ({
  useGameResults: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

it("renders a loading state when data is still pending", () => {
  (useGameResults as Mock).mockReturnValue({ data: undefined });
  render(<GameResults quizID="123" />);

  expect(screen.getByText("...")).toBeInTheDocument();
});

it("renders the game results when data is available", () => {
  const mockData = {
    leaderboard: [
      { id: "1", displayName: "Rubber", score: 100 },
      { id: "2", displayName: "Dork", score: 50 },
    ],
    quiz: {
      title: "Sample Quiz",
      description: "This is a sample quiz description.",
    },
  };
  (useGameResults as Mock).mockReturnValue({ data: mockData });
  render(<GameResults quizID="123" />);

  expect(screen.getByText("Sample Quiz")).toBeInTheDocument();
  expect(
    screen.getByText("This is a sample quiz description.")
  ).toBeInTheDocument();

  const leaderboardItems = screen.getAllByRole("listitem");
  expect(leaderboardItems).toHaveLength(mockData.leaderboard.length);

  mockData.leaderboard.forEach((player, i) => {
    const listItem = within(leaderboardItems[i]);
    expect(
      listItem.getByText(new RegExp(player.displayName))
    ).toBeInTheDocument();
    expect(
      listItem.getByText(new RegExp(player.score.toString()))
    ).toBeInTheDocument();
  });
});
