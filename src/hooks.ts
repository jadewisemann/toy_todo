import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMe, signIn, signUp, signOut, fetchTasks, createTask, updateTask, deleteTask } from "./api";
import type { Task } from "./api";

// Auth Hooks
export const useAuth = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const queryClient = useQueryClient();

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });

  const signUpMutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["auth", "me"] }),
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    authError: signInMutation.error || signUpMutation.error || signOutMutation.error,
  };
};

// Todo Hooks
export const useTodos = () => {
  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTasks,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: Task["id"]; data: Partial<Task> }) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  const completedCount = tasks.filter((t) => t.is_completed).length;

  return {
    tasks,
    isLoading,
    isError,
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    stats: {
      total: tasks.length,
      completed: completedCount,
      progress: tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0,
    },
  };
};
