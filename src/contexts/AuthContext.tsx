import { createContext, useContext, useState, useEffect } from "react";
import type { PropsWithChildren } from "react";
import type { User } from "firebase/auth";

import * as auth from "../services/auth";

type AuthContextObject = {
  user: User | null;
  isLoadingUser: boolean;
  signin: () => void;
  signinAnonymously: () => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextObject | {}>({});

export function useAuth(): AuthContextObject | {} {
  return useContext(AuthContext);
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
