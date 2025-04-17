import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileForm } from "@/components/candidate/settings/profile-form";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe("ProfileForm", () => {
  it("renders profile form fields", () => {
    render(<ProfileForm />);
    expect(screen.getByText(/full name/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText(/bio/i)).toBeInTheDocument();
    expect(screen.getByText(/location/i)).toBeInTheDocument();
    expect(screen.getByText(/website/i)).toBeInTheDocument();
    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });

  it("allows input in form fields", () => {
    render(<ProfileForm />);
    const nameInput = screen.getByPlaceholderText(/john doe/i);
    const bioInput = screen.getByPlaceholderText(/tell us about yourself/i);
    const locationInput = screen.getByPlaceholderText(/city, country/i);

    fireEvent.change(nameInput, { target: { value: "John Smith" } });
    fireEvent.change(bioInput, { target: { value: "I am a software developer" } });
    fireEvent.change(locationInput, { target: { value: "New York, USA" } });

    expect(nameInput).toHaveValue("John Smith");
    expect(bioInput).toHaveValue("I am a software developer");
    expect(locationInput).toHaveValue("New York, USA");
  });

  it("validates required fields on submit", async () => {
    render(<ProfileForm />);
    
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/name must be at least/i)).toBeInTheDocument();
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it("validates website URL format", async () => {
    render(<ProfileForm />);
    
    const websiteInput = screen.getByPlaceholderText(/https:\/\/example.com/i);
    fireEvent.change(websiteInput, { target: { value: "invalid-url" } });
    
    const submitButton = screen.getByRole("button", { name: /save changes/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText(/invalid url/i)).toBeInTheDocument();
  });
});