import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SignIn } from "../SignIn";
import { useAuth } from "../../hooks";
import { MemoryRouter } from "react-router";
import { ToastProvider } from "../../components/Toast";

vi.mock("../../hooks", () => ({
  useAuth: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual as any,
    useNavigate: () => mockNavigate,
  };
});

describe("SignIn Page", () => {
  it("renders form elements correctly", () => {
    (useAuth as any).mockReturnValue({
      signIn: vi.fn(),
      isSigningIn: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <ToastProvider>
          <SignIn />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("submits the form with username and password", () => {
    const mockSignIn = vi.fn();
    (useAuth as any).mockReturnValue({
      signIn: mockSignIn,
      isSigningIn: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <ToastProvider>
          <SignIn />
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(mockSignIn).toHaveBeenCalledWith(
      { username: "testuser", password: "password123" },
      expect.any(Object)
    );
  });

  it("handles successful sign in, shows toast and redirects", async () => {
    vi.useFakeTimers();
    
    const mockSignIn = vi.fn((_, options) => {
      options.onSuccess();
    });

    (useAuth as any).mockReturnValue({
      signIn: mockSignIn,
      isSigningIn: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <ToastProvider>
          <SignIn />
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));

    expect(screen.getByText(/로그인에 성공했습니다/)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/todos");

    vi.useRealTimers();
  });
});
