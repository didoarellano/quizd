import { Route, Redirect, useRouter } from "wouter";

import type { PropsWithChildren } from "react";
import { useAuth } from "../contexts/AuthContext";

type PrivateRouteProps = {
  path: string;
  nest?: boolean;
  isAllowed: boolean;
  redirectTo?: string;
  replace?: boolean;
};

export function PrivateRoute({
  path,
  nest = false,
  isAllowed,
  redirectTo = "/",
  replace = false,
  children,
}: PropsWithChildren<PrivateRouteProps>) {
  const { isLoadingUser } = useAuth();
  const { base } = useRouter();
  const redirectPath = `~${base}${redirectTo}`;

  return (
    <Route path={path} nest={nest}>
      {() => {
        if (isLoadingUser) return <p>...</p>;
        return isAllowed ? (
          children
        ) : (
          <Redirect to={redirectPath} replace={replace} />
        );
      }}
    </Route>
  );
}
