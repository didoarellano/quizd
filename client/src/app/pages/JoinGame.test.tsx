import { JoinGame } from "@/app/pages/JoinGame";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

const mockSetLocation = vi.fn();
vi.mock("wouter", () => ({
  useLocation: () => [null, mockSetLocation],
}));

afterEach(() => {
  vi.clearAllMocks();
});

it("redirects to /{PIN} on entering 6-digit PIN", () => {
  render(<JoinGame />);
  const inputs = screen.getAllByLabelText(/digit \d/i);
  inputs.forEach((input, i) => {
    fireEvent.change(input, { target: { value: i + 1 } });
  });
  expect(mockSetLocation).toHaveBeenCalledWith("/123456");
});
