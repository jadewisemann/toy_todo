import { TodoItem } from "./TodoItem";
import type { Task } from "@/types/task";
import type { TaskActions } from "@/hooks/useTaskActions";

type TodoListProps = {
  deleteTask: TaskActions["deleteTask"];
  isMutating: boolean;
  tasks: Task[];
  toggleTask: TaskActions["toggleTask"];
};

export const TodoList = ({
  deleteTask,
  isMutating,
  tasks,
  toggleTask,
}: TodoListProps) => (
  <ul className="space-y-2">
    {tasks.map((task) => (
      <TodoItem
        deleteTask={deleteTask}
        isMutating={isMutating}
        key={task.id}
        task={task}
        toggleTask={toggleTask}
      />
    ))}
  </ul>
);
