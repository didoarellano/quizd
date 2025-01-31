import { GameStatusKeys } from "@/types/game";
import { createContext, ReactNode, useContext } from "react";

type GameRouterProps = {
  status: GameStatusKeys;
  children: ReactNode;
};

const GameContext = createContext<GameStatusKeys | null>(null);

export function GameRouter({ status, children }: GameRouterProps) {
  return <GameContext.Provider value={status}>{children}</GameContext.Provider>;
}

type RouteProps = {
  status: GameStatusKeys;
  component: ReactNode;
};

export function Route({ status, component }: RouteProps) {
  const gameStatus = useContext(GameContext);
  if (!status || gameStatus === status) {
    return <>{component}</>;
  }
  return null;
}
