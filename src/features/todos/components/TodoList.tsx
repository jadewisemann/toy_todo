import { TodoItem } from "./TodoItem";
import type { Task } from "../types";

type TodoListProps = {
  isMutating: boolean;
  onDelete: (id: Task["id"]) => void;
  onToggle: (id: Task["id"], isCompleted: boolean) => void;
  tasks: Task[];
};

export const TodoList = ({
  isMutating,
  onDelete,
  onToggle,
  tasks,
}: TodoListProps) => (
  <ul className="space-y-2">
    {tasks.map((task) => (
      <TodoItem
        isMutating={isMutating}
        key={task.id}
        onDelete={onDelete}
        onToggle={onToggle}
        task={task}
      />
    ))}
  </ul>
);
