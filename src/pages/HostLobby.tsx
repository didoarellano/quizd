import { Link } from "wouter";

export function HostLobby() {
  return (
    <>
      <h1>Host Lobby</h1>
      <Link href="/play">Play</Link>
      <Link href="/results">Results</Link>
      <div>
        <h3>Players</h3>
      </div>
    </>
  );
}
