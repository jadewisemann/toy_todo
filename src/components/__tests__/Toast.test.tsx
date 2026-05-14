import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ToastProvider, useToast } from "../Toast";

const TestComponent = () => {
  const { toast } = useToast();
  return (
    <button onClick={() => toast("Test Message", { type: "success" })}>
      Show Toast
    </button>
  );
};

describe("Toast Component", () => {
  it("shows a toast message when triggered and auto-dismisses", async () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Should not be in document initially
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();

    // Trigger toast
    fireEvent.click(screen.getByText("Show Toast"));

    // Should appear
    expect(screen.getByText("Test Message")).toBeInTheDocument();

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Should disappear
    expect(screen.queryByText("Test Message")).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
