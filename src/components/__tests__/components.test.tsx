import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button, Input, Checkbox, Label, Card } from "../index";

describe("UI Components", () => {
  describe("Button", () => {
    it("renders children correctly", () => {
      render(<Button>Click Me</Button>);
      expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
    });

    it("handles click events", () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole("button", { name: /click me/i }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Input", () => {
    it("allows typing", () => {
      render(<Input placeholder="Type here" />);
      const input = screen.getByPlaceholderText("Type here");
      fireEvent.change(input, { target: { value: "Hello" } });
      expect(input).toHaveValue("Hello");
    });
  });

  describe("Checkbox", () => {
    it("toggles checked state", () => {
      const onChange = vi.fn();
      render(<Checkbox checked={false} onChange={onChange} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
      fireEvent.click(checkbox);
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Label", () => {
    it("renders text associated with input", () => {
      render(
        <div>
          <Label htmlFor="test-input">Test Label</Label>
          <Input id="test-input" />
        </div>
      );
      expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    });
  });

  describe("Card", () => {
    it("renders compound components correctly", () => {
      render(
        <Card>
          <Card.Header>
            <Card.Title>Card Title</Card.Title>
            <Card.Description>Card Description</Card.Description>
          </Card.Header>
          <Card.Content>Content</Card.Content>
          <Card.Footer>Footer</Card.Footer>
        </Card>
      );
      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card Description")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });
  });
});
