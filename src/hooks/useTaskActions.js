import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  updateTask,
} from "@/api/tasks";

export const TASKS_QUERY_KEY = ["tasks"];

export const useTaskActions = ({ onCreateSuccess } = {}) => {
  const queryClient = useQueryClient();

  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
  };

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      invalidateTasks();
      onCreateSuccess?.();
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, isCompleted }) =>
      updateTask(id, { is_completed: isCompleted }),
    onSuccess: invalidateTasks,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidateTasks,
  });

  return {
    createTask: createTaskMutation,
    deleteTask: deleteTaskMutation,
    isMutating: toggleTaskMutation.isPending || deleteTaskMutation.isPending,
    toggleTask: toggleTaskMutation,
  };
};
