import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuth, useTodos } from "../hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as api from "../api";
import React from "react";

vi.mock("../api");

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("Hooks", () => {
  beforeEach(() => {
    queryClient.clear();
    vi.clearAllMocks();
  });

  describe("useAuth", () => {
    it("should fetch user data", async () => {
      const mockUser = { username: "testuser", nickname: "Tester", email: "test@test.com" };
      (api.fetchMe as any).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("should return unauthenticated if fetchMe fails", async () => {
      (api.fetchMe as any).mockRejectedValue(new Error("Unauthorized"));

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.user).toBeUndefined(); // React Query returns undefined when error and no data
      // Actually fetchMe catches errors and returns null. Let's mock it to return null.
      (api.fetchMe as any).mockResolvedValue(null);
      
      const { result: res2 } = renderHook(() => useAuth(), { wrapper });
      await waitFor(() => expect(res2.current.isLoading).toBe(false));
      expect(res2.current.user).toBeNull();
      expect(res2.current.isAuthenticated).toBe(false);
    });
  });

  describe("useTodos", () => {
    it("should fetch tasks and calculate stats", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", is_completed: true, created_at: "" },
        { id: 2, title: "Task 2", is_completed: false, created_at: "" },
      ];
      (api.fetchTasks as any).mockResolvedValue(mockTasks);

      const { result } = renderHook(() => useTodos(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.tasks).toEqual(mockTasks);
      expect(result.current.stats).toEqual({
        total: 2,
        completed: 1,
        progress: 50,
      });
    });
  });
});
