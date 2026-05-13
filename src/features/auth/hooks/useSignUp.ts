import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api";

export const useSignUp = () =>
  useMutation({
    mutationFn: signUp,
  });
