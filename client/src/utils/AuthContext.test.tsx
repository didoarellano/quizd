import * as auth from "@/services/auth";
import { AuthProvider, useAuth } from "@/utils/AuthContext";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/services/auth", () => ({
  signin: vi.fn(),
  signinAnonymously: vi.fn(),
  signout: vi.fn(),
  onAuthChange: vi.fn(),
}));

const TestComponent = () => {
  const { user, isLoadingUser, signin, signinAnonymously, signout } = useAuth();

  return (
    <div>
      <p data-testid="user">{user ? user.displayName : "No User"}</p>
      <p data-testid="loading">{isLoadingUser ? "Loading..." : "Loaded"}</p>
      <button onClick={signin}>Sign In</button>
      <button onClick={signinAnonymously}>Sign In Anonymously</button>
      <button onClick={signout}>Sign Out</button>
    </div>
  );
};

describe("AuthContext Provider", () => {
  const mockUser = { id: "asdf", displayName: "rubberdork" };
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should render children and provide initial loading state", () => {
    (auth.onAuthChange as Mock).mockImplementation((_cb: any) => {
      // don't call callback passed to onAuthChange to simulate
      // initial/no auth state change
    });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("Loading...");
    expect(screen.getByTestId("user")).toHaveTextContent("No User");
  });

  it("should update user state when auth changes", () => {
    (auth.onAuthChange as Mock).mockImplementation((callback: any) => {
      callback(mockUser);
    });
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("Loaded");
    expect(screen.getByTestId("user")).toHaveTextContent("rubberdork");
  });

  it("should handle signin", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    screen.getByText("Sign In").click();

    expect(auth.signin).toHaveBeenCalled();
  });

  it("should handle anonymous signin", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    screen.getByText("Sign In Anonymously").click();

    expect(auth.signinAnonymously).toHaveBeenCalled();
  });

  it("should handle signout", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    screen.getByText("Sign Out").click();

    expect(auth.signout).toHaveBeenCalled();
  });

  it("useAuth should throw if used outside of AuthProvider", () => {
    const ThrowingComponent = () => {
      try {
        useAuth();
        return <p>Hook didn't throw</p>;
      } catch (error: any) {
        return <p data-testid="error">{error.message}</p>;
      }
    };
    render(<ThrowingComponent />);

    expect(screen.getByTestId("error")).toHaveTextContent(
      "useAuth should be used inside an <AuthProvider>"
    );
  });
});
