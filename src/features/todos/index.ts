import { TodoCard } from "./components/TodoCard";
import { TodoEmpty } from "./components/TodoEmpty";
import { TodoError } from "./components/TodoError";
import { TodoForm } from "./components/TodoForm";
import { TodoHeader } from "./components/TodoHeader";
import { TodoList } from "./components/TodoList";
import { TodoSkeleton } from "./components/TodoSkeleton";

import { useCreateTask } from "./hooks/useCreateTask";
import { useDeleteTask } from "./hooks/useDeleteTask";
import { useTasks } from "./hooks/useTasks";
import { useTaskStats } from "./hooks/useTaskStats";
import { useTodos } from "./hooks/useTodos";
import { useUpdateTask } from "./hooks/useUpdateTask";

export const Todo = {
  Card: TodoCard,
  Empty: TodoEmpty,
  Error: TodoError,
  Form: TodoForm,
  Header: TodoHeader,
  List: TodoList,
  Skeleton: TodoSkeleton,
};

export const todoHooks = {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useTaskStats,
  useTodos,
  useUpdateTask,
};


export type { Task } from "./types";
