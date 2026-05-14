import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SignIn } from "../SignIn";
import { useAuth } from "../../hooks";
import { MemoryRouter } from "react-router";
import React from "react";

vi.mock("../../hooks", () => ({
  useAuth: vi.fn(),
}));

describe("SignIn Page", () => {
  it("renders form elements correctly", () => {
    (useAuth as any).mockReturnValue({
      signIn: vi.fn(),
      isSigningIn: false,
      isAuthenticated: false,
    });

    render(
      <MemoryRouter>
        <SignIn />
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
        <SignIn />
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
});
