import type { AppRoute } from "@/app/routes/types";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";

export const authRoutes = [
  {
    element: <SignInPage />,
    mode: "publicOnly",
    path: "/signin",
  },
  {
    element: <SignUpPage />,
    mode: "publicOnly",
    path: "/signup",
  },
] satisfies AppRoute[];
