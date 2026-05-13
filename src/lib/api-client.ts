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

const buildApiUrl = (path: string): string =>
  `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

type ApiRequestOptions = RequestInit & {
  parseError?: boolean;
};

export const apiRequest = async <T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const { parseError = true, ...requestOptions } = options;
  const response = await fetch(buildApiUrl(path), {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...requestOptions.headers,
    },
    ...requestOptions,
  });

  if (!response.ok) {
    const message = parseError ? await readErrorMessage(response) : "";
    throw new Error(message || `Request failed with ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};

const readErrorMessage = async (response: Response): Promise<string> => {
  const text = await response.text();
  if (!text) return "";

  try {
    const data = JSON.parse(text) as { detail?: string; message?: string };
    return data.message ?? data.detail ?? text;
  } catch {
    return text;
  }
};
