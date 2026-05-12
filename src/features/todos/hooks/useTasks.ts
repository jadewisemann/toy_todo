import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "../api";
import { TASKS_QUERY_KEY } from "../constants";
import type { Task } from "../types";

export const useTasks = () =>
  useQuery<Task[]>({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
  });
