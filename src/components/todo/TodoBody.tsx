import { EmptyTodo } from "./EmptyTodo";
import { TodoError } from "./TodoError";
import { TodoList } from "./TodoList";
import { TodoSkeleton } from "./TodoSkeleton";
import type { UseQueryResult } from "@tanstack/react-query";
import type { Task } from "@/types/task";
import type { TaskActions } from "@/hooks/useTaskActions";

type TodoBodyProps = {
  deleteTask: TaskActions["deleteTask"];
  isMutating: boolean;
  tasks: Task[];
  tasksQuery: UseQueryResult<Task[], Error>;
  toggleTask: TaskActions["toggleTask"];
};

export const TodoBody = ({
  deleteTask,
  isMutating,
  tasks,
  tasksQuery,
  toggleTask,
}: TodoBodyProps) => {
  if (tasksQuery.isLoading) {
    return <TodoSkeleton />;
  }

  if (tasksQuery.isError) {
    return <TodoError />;
  }

  if (tasks.length === 0) {
    return <EmptyTodo />;
  }

  return (
    <TodoList
      deleteTask={deleteTask}
      isMutating={isMutating}
      tasks={tasks}
      toggleTask={toggleTask}
    />
  );
};
