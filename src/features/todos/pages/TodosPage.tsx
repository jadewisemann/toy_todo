import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { TodoCard } from "../components/TodoCard";
import { TodoEmpty } from "../components/TodoEmpty";
import { TodoError } from "../components/TodoError";
import { TodoForm } from "../components/TodoForm";
import { TodoHeader } from "../components/TodoHeader";
import { TodoList } from "../components/TodoList";
import { TodoSkeleton } from "../components/TodoSkeleton";
import { useCreateTask } from "../hooks/useCreateTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { useTodos } from "../hooks/useTodos";
import { useUpdateTask } from "../hooks/useUpdateTask";
import type { Task } from "../types";

export const TodosPage = () => {
  const [title, setTitle] = useState("");

  const todos = useTodos();

  const {
    isPending: isCreating,
    mutate: createTask,
  } = useCreateTask({
    onSuccess: () => setTitle(""),
  });
  const {
    isPending: isUpdating,
    mutate: updateTask,
  } = useUpdateTask();
  const {
    isPending: isDeleting,
    mutate: deleteTask,
  } = useDeleteTask();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const nextTitle = title.trim();
      if (!nextTitle) return;

      createTask(nextTitle);
    },
    [createTask, title],
  );

  const handleDelete = useCallback(
    (id: Task["id"]) => {
      deleteTask(id);
    },
    [deleteTask],
  );

  const handleToggle = useCallback(
    (id: Task["id"], isCompleted: boolean) => {
      updateTask({ id, isCompleted });
    },
    [updateTask],
  );

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <TodoCard>
        <TodoHeader stats={todos.stats} />
        <TodoCard.Body>
          <TodoForm
            isCreating={isCreating}
            onSubmit={handleSubmit}
            setTitle={setTitle}
            title={title}
          />
          <TodoCard.Divider />
          {todos.query.isLoading ? <TodoSkeleton /> : null}
          {todos.query.isError ? <TodoError /> : null}
          {todos.isReady && !todos.hasTasks ? <TodoEmpty /> : null}
          {todos.isReady && todos.hasTasks ? (
            <TodoList
              isMutating={isUpdating || isDeleting}
              onDelete={handleDelete}
              onToggle={handleToggle}
              tasks={todos.tasks}
            />
          ) : null}
        </TodoCard.Body>
      </TodoCard>
    </section>
  );
};
