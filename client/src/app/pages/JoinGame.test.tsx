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

it("redirects to /PIN on form submit", () => {
  render(<JoinGame />);
  const input = screen.getByLabelText(/pin code/i);
  const form = screen.getByRole("form", { name: /join game/i });
  fireEvent.change(input, { target: { value: "123456" } });
  fireEvent.submit(form);

  expect(mockSetLocation).toHaveBeenCalledWith("/123456");
});
