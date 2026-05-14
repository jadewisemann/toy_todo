import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Todos } from "../Todos";
import { useAuth, useTodos } from "../../hooks";

// Mocking the custom hooks
vi.mock("../../hooks", () => ({
  useAuth: vi.fn(),
  useTodos: vi.fn(),
}));

describe("Todos Page - Sign Out Modal", () => {
  it("should show a confirmation modal when Sign Out is clicked", () => {
    const mockSignOut = vi.fn();
    (useAuth as any).mockReturnValue({
      user: { nickname: "TestUser" },
      signOut: mockSignOut,
    });
    (useTodos as any).mockReturnValue({
      tasks: [],
      isLoading: false,
      isError: false,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      stats: { total: 0, completed: 0, progress: 0 },
    });

    render(<Todos />);

    // Initially, the modal should not be visible
    expect(screen.queryByText(/정말 로그아웃 하시겠습니까\?/)).not.toBeInTheDocument();

    // Click the Sign Out button
    const signOutBtn = screen.getByRole("button", { name: /Sign Out/i });
    fireEvent.click(signOutBtn);

    // Now the modal should be visible
    expect(screen.getByText(/정말 로그아웃 하시겠습니까\?/)).toBeInTheDocument();

    // signOut function should NOT be called yet
    expect(mockSignOut).not.toHaveBeenCalled();

    // Click confirm inside the modal
    const confirmBtn = screen.getByRole("button", { name: /확인/i });
    fireEvent.click(confirmBtn);

    // Now signOut should be called
    expect(mockSignOut).toHaveBeenCalled();
  });
});
