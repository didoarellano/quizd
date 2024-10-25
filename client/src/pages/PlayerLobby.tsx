import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Redirect, useParams } from "wouter";
import { GameStatus, StoredGame } from "../../../shared/game.types";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../services/firebase";

export function PlayerLobby() {
  const { gameID } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState<StoredGame | null>(null);

  useEffect(() => {
    if (!gameID) return;
    const gameRef = doc(db, "games", gameID);
    const unsubscribe = onSnapshot(gameRef, async (snapshot) => {
      const gameData = snapshot.data();
      if (gameData) setGame(gameData as StoredGame);
    });
    return unsubscribe;
  }, [gameID]);

  if (!gameID) return <Redirect to="/" />;

  if (game?.status === GameStatus.PENDING) {
    return (
      <>
        <p>Welcome {user?.displayName}!</p>
        <p>Waiting for host to start the game.</p>
      </>
    );
  }

  if (game?.status === GameStatus.ONGOING) {
    return <p>Current Question: {game.currentQuestionIndex}</p>;
  }

  return <p>...</p>;
}
