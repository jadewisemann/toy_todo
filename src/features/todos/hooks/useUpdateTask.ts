import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../api";
import { TASKS_QUERY_KEY } from "../constants";
import type { Task } from "../types";

type UpdateTaskVariables = {
  id: Task["id"];
  isCompleted: boolean;
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isCompleted }: UpdateTaskVariables) =>
      updateTask(id, { is_completed: isCompleted }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};
