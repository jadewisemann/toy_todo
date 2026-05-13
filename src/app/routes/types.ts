import type { ReactElement } from "react";

export type AuthRouteMode = "protected" | "publicOnly";

export type AppRoute = {
  element: ReactElement;
  mode: AuthRouteMode;
  path: string;
};
