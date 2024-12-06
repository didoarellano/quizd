import { Player } from "@/types/game";

export function PlayerList({ players }: { players: Player[] }) {
  return (
    <div>
      <h3>Players</h3>
      <ul>
        {players &&
          players.map((player) => (
            <li key={player.id}>{player.displayName}</li>
          ))}
      </ul>
    </div>
  );
}
