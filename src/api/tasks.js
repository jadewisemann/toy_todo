const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return "/api";
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  throw new Error("Missing VITE_API_BASE_URL environment variable.");
};

const API_BASE_URL = getApiBaseUrl();

const buildUrl = (path) =>
  `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

const request = async (path, options = {}) => {
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
    return null;
  }

  return response.json();
};

export const fetchTasks = () => request("/tasks/");

export const createTask = (title) =>
  request("/tasks/", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTask = (id, data) =>
  request(`/tasks/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}/`, {
    method: "DELETE",
  });
