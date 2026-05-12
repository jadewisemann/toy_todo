import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../api";
import { TASKS_QUERY_KEY } from "../constants";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};
