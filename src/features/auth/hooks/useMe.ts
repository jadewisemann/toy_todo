import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api";
import { AUTH_QUERY_KEY } from "../constants";

export const useMe = () =>
  useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchMe,
    staleTime: 30_000,
  });
