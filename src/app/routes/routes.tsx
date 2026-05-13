import { authRoutes } from "@/features/auth/routes";
import { todoRoutes } from "@/features/todos/routes";

export const appRoutes = [...authRoutes, ...todoRoutes];
