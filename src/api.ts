export type User = {
  username: string;
  nickname: string;
  email: string;
};

export type Task = {
  id: number;
  title: string;
  is_completed: boolean;
  created_at: string;
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(requestOptions.headers as Record<string, string>),
  };

  // 백엔드 명세에 따라 HttpOnly 쿠키 방식을 사용하므로 credentials 옵션을 켭니다.
  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text;
    if (parseError) {
      try {
        const data = JSON.parse(text);
        message = data.detail ?? data.message ?? text;
      } catch { }
    }
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204 || (response.status === 200 && response.headers.get("content-length") === "0")) {
    return null as T;
  }
  
  const text = await response.text();
  if (!text) return null as T;
  return JSON.parse(text) as T;
};

// Auth API
export const fetchMe = async (): Promise<User | null> => {
  try {
    // 명세에는 없지만 로그인 여부 확인 및 UI 표시를 위해 유지
    const data = await apiRequest<User>("/accounts/me/", { parseError: false });
    return data;
  } catch {
    return null;
  }
};

export const signIn = async (data: any) => {
  const response = await apiRequest<{ message: string }>("/accounts/login/", {
    method: "POST",
    body: JSON.stringify(data)
  });
  return response;
};

export const signUp = async (data: any) => {
  const response = await apiRequest<User>("/accounts/register/", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "omit", // 기존 찌꺼기 쿠키가 서버로 전송되어 에러를 유발하는 것을 차단합니다.
  });
  return response;
};

export const signOut = async () => {
  await apiRequest<{ message: string }>("/accounts/logout/", { method: "POST" });
};

// Todos API
export const fetchTasks = async (): Promise<Task[]> => {
  const data = await apiRequest<Task[]>("/todos/tasks/");
  return data;
};

export const createTask = async (title: string): Promise<Task> => {
  const data = await apiRequest<Task>("/todos/tasks/", { method: "POST", body: JSON.stringify({ title, is_completed: false }) });
  return data;
};

export const updateTask = async (id: Task["id"], data: Partial<Task>): Promise<Task> => {
  const res = await apiRequest<Task>(`/todos/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ is_completed: data.is_completed }),
  });
  return res;
};

export const deleteTask = (id: Task["id"]): Promise<null> => apiRequest<null>(`/todos/tasks/${id}/`, { method: "DELETE" });
