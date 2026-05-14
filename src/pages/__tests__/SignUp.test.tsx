import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SignUp } from "../SignUp";
import { useAuth } from "../../hooks";
import { MemoryRouter } from "react-router";
import { ToastProvider } from "../../components/Toast";
import React from "react";

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

describe("SignUp Page", () => {
  it("renders all form inputs correctly", () => {
    (useAuth as any).mockReturnValue({
      signUp: vi.fn(),
      signIn: vi.fn(),
      isSigningUp: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <ToastProvider>
          <SignUp />
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nickname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("handles successful signup, shows toast, signs in, and redirects", async () => {
    vi.useFakeTimers();
    
    const mockSignUp = vi.fn((data, options) => {
      options.onSuccess();
    });
    const mockSignIn = vi.fn();
    
    (useAuth as any).mockReturnValue({
      signUp: mockSignUp,
      signIn: mockSignIn,
      isSigningUp: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <ToastProvider>
          <SignUp />
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "newuser" } });
    fireEvent.change(screen.getByLabelText(/Nickname/i), { target: { value: "tester" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "pass123" } });
    fireEvent.click(screen.getByRole("button", { name: /Sign Up/i }));

    // Verify SignUp was called
    expect(mockSignUp).toHaveBeenCalled();

    // Verify Toast appears (synchronous because mockSignUp calls onSuccess synchronously)
    expect(screen.getByText(/회원가입이 완료되었습니다/)).toBeInTheDocument();

    // Fast forward to trigger signIn (500ms delay)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Verify SignIn was called automatically after 500ms
    expect(mockSignIn).toHaveBeenCalledWith(
      { username: "newuser", password: "pass123" },
      expect.any(Object)
    );

    // mockSignIn needs to call onSuccess so that the timeout is registered
    const signInOptions = mockSignIn.mock.calls[0][1];
    signInOptions.onSuccess();

    // Fast forward to trigger redirect (2000ms delay)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/todos");

    vi.useRealTimers();
  });
});
