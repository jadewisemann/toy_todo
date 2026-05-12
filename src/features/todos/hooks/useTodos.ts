import { useTasks } from "./useTasks";
import { useTaskStats } from "./useTaskStats";

export const useTodos = () => {
  const query = useTasks();
  const tasks = query.data ?? [];
  const stats = useTaskStats(tasks);
  const isReady = !query.isLoading && !query.isError;

  return {
    hasTasks: tasks.length > 0,
    isReady,
    query,
    stats,
    tasks,
  };
};
