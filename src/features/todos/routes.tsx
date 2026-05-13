import type { AppRoute } from "@/app/routes/types";
import { TodosPage } from "./pages/TodosPage";

export const todoRoutes = [
  {
    element: <TodosPage />,
    mode: "protected",
    path: "/todos",
  },
] satisfies AppRoute[];
