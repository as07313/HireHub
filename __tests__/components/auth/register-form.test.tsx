import { render, screen, fireEvent } from "@testing-library/react";
import { RegisterForm } from "@/components/auth/register-form";

describe("RegisterForm", () => {
  it("renders registration fields", () => {
    render(<RegisterForm />);
    expect(screen.getByText(/full name/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/skillset/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
  });

  it("shows password when toggle is clicked", () => {
    render(<RegisterForm />);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const toggleButton = screen.getByRole("button", { name: "" });
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("displays error messages on invalid submit", async () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
    expect(await screen.findAllByText(/must be at least/i)).not.toHaveLength(0);
  });

  it("allows input in form fields", () => {
    render(<RegisterForm />);
    const nameInput = screen.getByPlaceholderText(/john doe/i);
    const emailInput = screen.getByPlaceholderText(/john@example.com/i);
    const skillsetInput = screen.getByPlaceholderText(/react, node.js/i);

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(skillsetInput, { target: { value: "React, TypeScript" } });

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(skillsetInput).toHaveValue("React, TypeScript");
  });
});
