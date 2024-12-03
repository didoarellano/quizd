import { render, screen } from "@testing-library/react";
import { describe, expect, it, Mock, vi } from "vitest";
import { useRouter } from "wouter";
import { useAuth } from "./AuthContext";
import { PrivateRoute } from "./PrivateRoute";

// Mock `useAuth` and `useRouter`
vi.mock("./AuthContext", () => ({
  useAuth: vi.fn(),
}));
vi.mock("wouter", () => ({
  Redirect: ({ to }: { to: string }) => <div>Redirecting to {to}</div>,
  Route: ({ children }: { children: any }) => children(),
  useRouter: vi.fn(),
}));

describe("PrivateRoute", () => {
  const mockUseAuth = useAuth as Mock;
  const mockUseRouter = useRouter as Mock;
  const MockLoadingSpinner = () => <div>MockLoadingSpinner...</div>;

  beforeEach(() => {
    mockUseAuth.mockReset();
    mockUseRouter.mockReset();
  });

  it("renders LoadingSpinner when user is still loading", () => {
    mockUseAuth.mockReturnValue({ isLoadingUser: true });
    mockUseRouter.mockReturnValue({ base: "" });

    render(
      <PrivateRoute
        path="/protected"
        isAllowed={true}
        LoadingSpinner={MockLoadingSpinner}
      >
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText("MockLoadingSpinner...")).toBeInTheDocument();
  });

  it("renders children when access is allowed", () => {
    mockUseAuth.mockReturnValue({ isLoadingUser: false });
    mockUseRouter.mockReturnValue({ base: "" });

    render(
      <PrivateRoute path="/protected" isAllowed={true}>
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects when access is not allowed", () => {
    mockUseAuth.mockReturnValue({ isLoadingUser: false });
    mockUseRouter.mockReturnValue({ base: "" });

    render(
      <PrivateRoute path="/protected" isAllowed={false} redirectTo="/login">
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText("Redirecting to ~/login")).toBeInTheDocument();
  });

  it("applies the base path to the redirect URL", () => {
    mockUseAuth.mockReturnValue({ isLoadingUser: false });
    mockUseRouter.mockReturnValue({ base: "/app" });

    render(
      <PrivateRoute path="/protected" isAllowed={false} redirectTo="/login">
        <div>Protected Content</div>
      </PrivateRoute>
    );

    expect(screen.getByText("Redirecting to ~/app/login")).toBeInTheDocument();
  });
});
