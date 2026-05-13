import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "../api";
import { AUTH_QUERY_KEY } from "../constants";

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signIn,
    onSuccess: ({ user }) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
    },
  });
};
