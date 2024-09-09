import { createContext, useContext, useState, useEffect } from "react";
import type { PropsWithChildren } from "react";
import type { User } from "firebase/auth";

import * as auth from "../services/auth";

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

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

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, signin, signinAnonymously, signout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
