import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "../api";
import { AUTH_QUERY_KEY } from "../constants";
import { TASKS_QUERY_KEY } from "@/features/todos/constants";

export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};
