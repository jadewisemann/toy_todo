import { useMemo } from "react";

export const useTaskStats = (tasks) =>
  useMemo(() => {
    const completed = tasks.filter((task) => task.is_completed).length;

    return {
      total: tasks.length,
      completed,
      remaining: tasks.length - completed,
    };
  }, [tasks]);
