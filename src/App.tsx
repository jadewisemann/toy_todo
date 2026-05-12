import type { FormEvent } from "react";
import { useState } from "react";
import { Todo, todoHooks } from "@/features/todos";

const {
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useTodos,
} = todoHooks;

const App = () => {
  const [title, setTitle] = useState("");

  const todos = useTodos();
  
  const createTask = useCreateTask({
    onSuccess: () => setTitle(""),
  });
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTitle = title.trim();
    if (!nextTitle) return;

    createTask.mutate(nextTitle);
  };

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Todo.Card>
          <Todo.Header stats={todos.stats} />
          <Todo.Card.Body>
            <Todo.Form
              isCreating={createTask.isPending}
              onSubmit={handleSubmit}
              setTitle={setTitle}
              title={title}
            />
            <Todo.Card.Divider />
            {todos.query.isLoading ? <Todo.Skeleton /> : null}
            {todos.query.isError ? <Todo.Error /> : null}
            {todos.isReady && !todos.hasTasks ? <Todo.Empty /> : null}
            {todos.isReady && todos.hasTasks ? (
              <Todo.List
                isMutating={updateTask.isPending || deleteTask.isPending}
                onDelete={(id) => deleteTask.mutate(id)}
                onToggle={(id, isCompleted) =>
                  updateTask.mutate({ id, isCompleted })
                }
                tasks={todos.tasks}
              />
            ) : null}
          </Todo.Card.Body>
        </Todo.Card>
      </section>
    </main>
  );
};

export default App;
