export type User = {
  id: string;
  name: string;
};

export type Task = {
  id: number | string;
  title: string;
  is_completed: boolean;
  created_at: string | null;
};

const getApiBaseUrl = (): string => {
  if (import.meta.env.DEV) return "/api";
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  throw new Error("Missing VITE_API_BASE_URL environment variable.");
};

const API_BASE_URL = getApiBaseUrl();

const buildApiUrl = (path: string): string =>
  `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

export const apiRequest = async <T>(
  path: string,
  options: RequestInit & { parseError?: boolean } = {}
): Promise<T> => {
  const { parseError = true, ...requestOptions } = options;
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(requestOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(path), {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    if (parseError) {
      try {
        const data = JSON.parse(text);
        message = data.message ?? data.detail ?? text;
      } catch {}
    }
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
};

// Auth API
export const fetchMe = async (): Promise<User | null> => {
  try {
    const data = await apiRequest<{ user: User }>("/auth/me", { parseError: false });
    return data.user;
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export const signIn = async (data: any) => {
  const response = await apiRequest<{ token: string; user: User }>("/auth/signin", { 
    method: "POST", 
    body: JSON.stringify(data) 
  });
  if (response.token) {
    localStorage.setItem("token", response.token);
  }
  return response;
};

export const signUp = async (data: any) => {
  const response = await apiRequest<{ token: string; user: User }>("/auth/signup", { 
    method: "POST", 
    body: JSON.stringify(data) 
  });
  if (response.token) {
    localStorage.setItem("token", response.token);
  }
  return response;
};

export const signOut = async () => {
  try {
    await apiRequest<null>("/auth/signout", { method: "POST" });
  } finally {
    localStorage.removeItem("token");
  }
};

// Todos API
const normalizeTask = (t: any): Task => ({
  id: t.id,
  title: t.title,
  is_completed: t.is_completed ?? t.completed ?? false,
  created_at: t.created_at ?? t.createdAt ?? null,
});

export const fetchTasks = async (): Promise<Task[]> => {
  const data = await apiRequest<any>("/todos");
  const tasks = Array.isArray(data) ? data : data.todos;
  return tasks.map(normalizeTask);
};

export const createTask = async (title: string): Promise<Task> => {
  const data = await apiRequest<any>("/todos", { method: "POST", body: JSON.stringify({ title }) });
  return normalizeTask("todo" in data ? data.todo : data);
};

export const updateTask = async (id: Task["id"], data: Partial<Task>): Promise<Task> => {
  const res = await apiRequest<any>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title: data.title, completed: data.is_completed, is_completed: data.is_completed }),
  });
  return normalizeTask("todo" in res ? res.todo : res);
};

export const deleteTask = (id: Task["id"]): Promise<null> => apiRequest<null>(`/todos/${id}`, { method: "DELETE" });
