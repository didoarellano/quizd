import { ComponentType, PropsWithChildren } from "react";
import { Redirect, Route, useRouter } from "wouter";
import { useAuth } from "./AuthContext";

type PrivateRouteProps = {
  path: string;
  nest?: boolean;
  isAllowed: boolean;
  redirectTo?: string;
  replace?: boolean;
  LoadingSpinner?: ComponentType;
};

export function PrivateRoute({
  path,
  nest = false,
  isAllowed,
  redirectTo = "/",
  replace = false,
  children,
  LoadingSpinner = () => <p>loading...</p>,
}: PropsWithChildren<PrivateRouteProps>) {
  const { isLoadingUser } = useAuth();
  const { base } = useRouter();
  const redirectPath = `~${base}${redirectTo}`;

  return (
    <Route path={path} nest={nest}>
      {() => {
        if (isLoadingUser) return <LoadingSpinner />;
        return isAllowed ? (
          children
        ) : (
          <Redirect to={redirectPath} replace={replace} />
        );
      }}
    </Route>
  );
}
