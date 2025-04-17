import { render, screen, fireEvent } from "@testing-library/react";
import { SecurityForm } from "../../components/candidate/settings/security-form";

describe("SecurityForm", () => {
  it("renders password change fields", () => {
    render(<SecurityForm />);
    expect(screen.getByText(/current password/i)).toBeInTheDocument();
    expect(screen.getByText(/new password/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm.*password/i)).toBeInTheDocument();
  });

  it("toggles password visibility for all password fields", () => {
    render(<SecurityForm />);
    const passwordFields = screen.getAllByRole("textbox", { hidden: true });
    const toggleButtons = screen.getAllByRole("button", { name: "" });

    // Test each password field
    passwordFields.forEach((field, index) => {
      expect(field).toHaveAttribute("type", "password");
      fireEvent.click(toggleButtons[index]);
      expect(field).toHaveAttribute("type", "text");
    });
  });

  it("displays validation errors on mismatched passwords", async () => {
    render(<SecurityForm />);
    
    const newPassword = screen.getByPlaceholderText(/new password/i);
    const confirmPassword = screen.getByPlaceholderText(/confirm.*password/i);
    
    fireEvent.change(newPassword, { target: { value: "newpass123" } });
    fireEvent.change(confirmPassword, { target: { value: "different123" } });
    
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    
    expect(await screen.findByText(/passwords don't match/i)).toBeInTheDocument();
  });

  it("validates minimum password length", async () => {
    render(<SecurityForm />);
    
    const newPassword = screen.getByPlaceholderText(/new password/i);
    fireEvent.change(newPassword, { target: { value: "short" } });
    
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    
    expect(await screen.findByText(/must be at least 8 characters/i)).toBeInTheDocument();
  });
});