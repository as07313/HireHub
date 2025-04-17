import { render, screen, fireEvent } from "@testing-library/react";
import { ModeToggle } from "../../components/mode-toggle";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

describe("ModeToggle", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders theme toggle button", () => {
    render(<ModeToggle />);
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("toggles from light to dark theme", () => {
    render(<ModeToggle />);
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    fireEvent.click(toggleButton);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("shows correct icon for light theme", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
    });

    render(<ModeToggle />);
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
  });

  it("shows correct icon for dark theme", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
    });

    render(<ModeToggle />);
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
  });

  it("applies correct ARIA label", () => {
    render(<ModeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveAttribute("aria-label", "Toggle theme");
  });

  it("maintains button functionality when theme is system", () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "system",
      setTheme: mockSetTheme,
    });

    render(<ModeToggle />);
    const toggleButton = screen.getByRole("button", { name: /toggle theme/i });

    fireEvent.click(toggleButton);
    expect(mockSetTheme).toHaveBeenCalled();
  });
});
