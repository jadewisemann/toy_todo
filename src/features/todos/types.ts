export type Task = {
  id: number | string;
  title: string;
  is_completed: boolean;
  created_at: string | null;
};

export type TaskStats = {
  total: number;
  completed: number;
  remaining: number;
};

export type ToggleTaskPayload = {
  id: Task["id"];
  isCompleted: boolean;
};

export type UpdateTaskPayload = Partial<Pick<Task, "title" | "is_completed">>;
