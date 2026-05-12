import type { Task, UpdateTaskPayload } from "@/types/task";

const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return "/api";
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  throw new Error("Missing VITE_API_BASE_URL environment variable.");
};

const API_BASE_URL = getApiBaseUrl();

const buildUrl = (path: string): string =>
  `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

const request = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

export const fetchTasks = (): Promise<Task[]> => request<Task[]>("/tasks/");

export const createTask = (title: string): Promise<Task> =>
  request<Task>("/tasks/", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTask = (
  id: Task["id"],
  data: UpdateTaskPayload,
): Promise<Task> =>
  request<Task>(`/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTask = (id: Task["id"]): Promise<null> =>
  request<null>(`/tasks/${id}/`, {
    method: "DELETE",
  });
