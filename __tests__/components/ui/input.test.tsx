import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders input element with default attributes", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex h-10 rounded-md border");
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("test value");
  });

  it("supports different types", () => {
    const { rerender } = render(<Input type="text" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");

    rerender(<Input type="password" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "password");

    rerender(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("handles disabled state", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  // it("applies error styles when error prop is true", () => {
  //   render(<Input error />);
  //   expect(screen.getByRole("textbox")).toHaveClass("border-destructive");
  // });

  it("supports placeholder text", () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-input");
  });

  it("forwards additional props", () => {
    render(
      <Input data-testid="test-input" aria-label="test input" maxLength={10} />
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-testid", "test-input");
    expect(input).toHaveAttribute("aria-label", "test input");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("supports required attribute", () => {
    render(<Input required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("renders with default value", () => {
    render(<Input defaultValue="default text" />);
    expect(screen.getByRole("textbox")).toHaveValue("default text");
  });
});
