import { Redirect, useParams } from "wouter";
import { useAuth } from "../contexts/AuthContext";

export function PlayerLobby() {
  const { gameID } = useParams();
  const { user } = useAuth();

  if (!gameID) return <Redirect to="/" />;

  return (
    <>
      <p>Welcome {user?.displayName}!</p>
      <p>Waiting for host to start the game.</p>
    </>
  );
}
