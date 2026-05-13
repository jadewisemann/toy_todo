import { apiRequest } from "@/lib/api-client";
import type { Task, UpdateTaskPayload } from "./types";

type ApiTask = {
  completed?: boolean;
  createdAt?: string | null;
  created_at?: string | null;
  id: number | string;
  is_completed?: boolean;
  title: string;
};

type ApiTaskListResponse = ApiTask[] | { todos: ApiTask[] };
type ApiTaskResponse = ApiTask | { todo: ApiTask };

const normalizeTask = (task: ApiTask): Task => ({
  id: task.id,
  title: task.title,
  is_completed: task.is_completed ?? task.completed ?? false,
  created_at: task.created_at ?? task.createdAt ?? null,
});

const normalizeTaskList = (data: ApiTaskListResponse): Task[] => {
  const tasks = Array.isArray(data) ? data : data.todos;
  return tasks.map(normalizeTask);
};

const normalizeTaskResponse = (data: ApiTaskResponse): Task => {
  const task = "todo" in data ? data.todo : data;
  return normalizeTask(task);
};

const toApiTaskPayload = (data: UpdateTaskPayload) => ({
  completed: data.is_completed,
  is_completed: data.is_completed,
  title: data.title,
});

export const fetchTasks = async (): Promise<Task[]> => {
  const data = await apiRequest<ApiTaskListResponse>("/todos");
  return normalizeTaskList(data);
};

export const createTask = async (title: string): Promise<Task> => {
  const data = await apiRequest<ApiTaskResponse>("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  return normalizeTaskResponse(data);
};

export const updateTask = (
  id: Task["id"],
  data: UpdateTaskPayload,
): Promise<Task> =>
  apiRequest<ApiTaskResponse>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(toApiTaskPayload(data)),
  }).then(normalizeTaskResponse);

export const deleteTask = (id: Task["id"]): Promise<null> =>
  apiRequest<null>(`/todos/${id}`, {
    method: "DELETE",
  });
