import { EmptyTodo } from "./EmptyTodo";
import { TodoError } from "./TodoError";
import { TodoList } from "./TodoList";
import { TodoSkeleton } from "./TodoSkeleton";

export const TodoBody = ({
  deleteTask,
  isMutating,
  tasks,
  tasksQuery,
  toggleTask,
}) => {
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
