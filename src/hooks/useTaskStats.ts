import { useMemo } from "react";
import type { Task, TaskStats } from "@/types/task";

export const useTaskStats = (tasks: Task[]): TaskStats =>
  useMemo(() => {
    const completed = tasks.filter((task) => task.is_completed).length;

    return {
      total: tasks.length,
      completed,
      remaining: tasks.length - completed,
    };
  }, [tasks]);
