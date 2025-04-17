import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "@/components/auth/login-form";

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/password/i)).toBeInTheDocument();
  });

  it("shows password when toggle is clicked", () => {
    render(<LoginForm />);
    const passwordInput = screen.getByTestId("password-input");
    const toggleButton = screen.getByTestId("toggle-password-visibility");
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("displays error on invalid submit", async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
  });
});
