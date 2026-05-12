import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../api";
import { TASKS_QUERY_KEY } from "../constants";

type UseCreateTaskOptions = {
  onSuccess?: () => void;
};

export const useCreateTask = ({ onSuccess }: UseCreateTaskOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
      onSuccess?.();
    },
  });
};
