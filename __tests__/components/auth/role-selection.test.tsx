import { render, screen, fireEvent } from "@testing-library/react";
import { RoleSelection } from "@/components/auth/role-selection";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RoleSelection", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders role selection options", () => {
    render(<RoleSelection />);
    expect(screen.getByText(/candidate/i)).toBeInTheDocument();
    expect(screen.getByText(/recruiter/i)).toBeInTheDocument();
  });

  it("navigates to candidate registration when candidate role selected", () => {
    render(<RoleSelection />);
    const candidateButton = screen.getByRole("button", { name: /candidate/i });
    fireEvent.click(candidateButton);
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining("/candidate")
    );
  });

  it("navigates to recruiter registration when recruiter role selected", () => {
    render(<RoleSelection />);
    const recruiterButton = screen.getByRole("button", { name: /recruiter/i });
    fireEvent.click(recruiterButton);
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining("/recruiter")
    );
  });

  it("displays role descriptions", () => {
    render(<RoleSelection />);
    expect(screen.getByText(/looking for jobs/i)).toBeInTheDocument();
    expect(screen.getByText(/hiring talent/i)).toBeInTheDocument();
  });

  it("renders role selection icons", () => {
    render(<RoleSelection />);
    expect(screen.getByTestId("candidate-icon")).toBeInTheDocument();
    expect(screen.getByTestId("recruiter-icon")).toBeInTheDocument();
  });

  it("shows hover states on role cards", () => {
    render(<RoleSelection />);
    const candidateCard = screen.getByTestId("candidate-card");

    fireEvent.mouseEnter(candidateCard);
    expect(candidateCard).toHaveClass("hover:border-primary");

    fireEvent.mouseLeave(candidateCard);
    expect(candidateCard).not.toHaveClass("hover:border-primary");
  });
});
