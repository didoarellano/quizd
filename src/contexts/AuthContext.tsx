import { createContext, useContext, useState, useEffect } from "react";
import type { PropsWithChildren } from "react";

import * as auth from "../services/auth";
import type { User } from "../services/auth";

type AuthContextObject = {
  user: User | null;
  isLoadingUser: boolean;
  signin: () => void;
  signinAnonymously: () => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextObject | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth should be used inside an <AuthProvider>");
  return ctx;
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    return auth.onAuthChange((user: User | null) => {
      setUser(user);
      setIsLoadingUser(false);
    });
  }, []);

  function signin() {
    setIsLoadingUser(true);
    auth.signin();
  }

  function signinAnonymously() {
    setIsLoadingUser(true);
    auth.signinAnonymously();
  }

  function signout() {
    auth.signout();
  }

  const value: AuthContextObject = {
    user,
    isLoadingUser,
    signin,
    signinAnonymously,
    signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
