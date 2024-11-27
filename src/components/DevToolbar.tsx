import { ResetGameButton } from "@/features/games-as-host/ResetGameButton";
import { useAuth } from "@/utils/AuthContext";
import { useLocation } from "wouter";

export function DevToolbar() {
  const { user, signin, signout, signinAnonymously } = useAuth();
  const [location] = useLocation();
  const hostRouteMatch = location.match(/^\/haderach\/host\/([^/]+)/);
  const quizID = hostRouteMatch && hostRouteMatch[1];

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {user && (
        <>
          <div>{user.displayName}</div>
          <div style={{ fontSize: "0.8rem" }}>{user.id}</div>
        </>
      )}

      {user ? (
        <button onClick={signout}>Signout</button>
      ) : (
        <>
          <button onClick={signin}>Signin</button>
          <button onClick={signinAnonymously}>Signin Anonymously</button>
        </>
      )}

      {user?.role === "teacher" && quizID && (
        <ResetGameButton quizID={quizID} />
      )}
    </div>
  );
}
