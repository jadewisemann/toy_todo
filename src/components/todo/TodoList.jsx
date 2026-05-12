import { TodoItem } from "./TodoItem";

export const TodoList = ({ deleteTask, isMutating, tasks, toggleTask }) => (
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
