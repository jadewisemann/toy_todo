import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import type { AuthRouteMode } from "./types";

type AuthRouteProps = {
  children: ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
  mode: AuthRouteMode;
};

export const AuthRoute = ({
  children,
  isAuthenticated,
  isLoading,
  mode,
}: AuthRouteProps) => {
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="mx-auto h-32 w-full max-w-sm rounded-md border bg-background" />
    );
  }

  if (mode === "protected" && !isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: `${location.pathname}${location.search}` }}
        to="/signin"
      />
    );
  }

  if (mode === "publicOnly" && isAuthenticated) {
    return <Navigate replace to="/todos" />;
  }

  return children;
};
