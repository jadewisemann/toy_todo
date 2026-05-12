import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTasks } from "@/api/tasks";
import { Card, CardContent, Separator } from "@/components/ui";
import {
  TodoBody,
  TodoForm,
  TodoHeader,
} from "@/components/todo";
import {
  TASKS_QUERY_KEY,
  useTaskActions,
  useTaskStats,
} from "@/hooks";

const App = () => {
  const [title, setTitle] = useState("");
  const taskActions = useTaskActions({
    onCreateSuccess: () => setTitle(""),
  });
  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: fetchTasks,
  });

  const tasks = tasksQuery.data ?? [];
  const stats = useTaskStats(tasks);

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextTitle = title.trim();
    if (!nextTitle) return;

    taskActions.createTask.mutate(nextTitle);
  };

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Card>
          <TodoHeader stats={stats} />
          <CardContent className="space-y-5">
            <TodoForm
              isCreating={taskActions.createTask.isPending}
              onSubmit={handleSubmit}
              setTitle={setTitle}
              title={title}
            />
            <Separator />
            <TodoBody
              deleteTask={taskActions.deleteTask}
              isMutating={taskActions.isMutating}
              tasks={tasks}
              tasksQuery={tasksQuery}
              toggleTask={taskActions.toggleTask}
            />
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default App;
