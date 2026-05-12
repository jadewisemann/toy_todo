import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  updateTask,
} from "@/api/tasks";
import type { Task, ToggleTaskPayload } from "@/types/task";

export const TASKS_QUERY_KEY = ["tasks"];

type UseTaskActionsOptions = {
  onCreateSuccess?: () => void;
};

export type TaskActions = {
  createTask: UseMutationResult<Task, Error, string>;
  deleteTask: UseMutationResult<null, Error, Task["id"]>;
  isMutating: boolean;
  toggleTask: UseMutationResult<Task, Error, ToggleTaskPayload>;
};

export const useTaskActions = ({
  onCreateSuccess,
}: UseTaskActionsOptions = {}): TaskActions => {
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
    mutationFn: ({ id, isCompleted }: ToggleTaskPayload) =>
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
