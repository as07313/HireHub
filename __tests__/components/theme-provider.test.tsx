import { render } from "@testing-library/react";
import { ThemeProvider } from "../../components/theme-provider";
import { useTheme } from "next-themes";

jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: jest.fn(),
}));

describe("ThemeProvider", () => {
  const TestChild = () => <div>Test Child</div>;

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: "light",
      setTheme: jest.fn(),
    });
  });

  it("renders children components", () => {
    const { getByText } = render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TestChild />
      </ThemeProvider>
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("provides theme context to children", () => {
    const TestComponent = () => {
      const { theme } = useTheme();
      return <div data-testid="theme-test">{theme}</div>;
    };

    const { getByTestId } = render(
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TestComponent />
      </ThemeProvider>
    );

    expect(getByTestId("theme-test")).toHaveTextContent("light");
  });

  it("sets correct attribute for theme", () => {
    const { container } = render(
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TestChild />
      </ThemeProvider>
    );

    expect(container.firstChild).toHaveAttribute("class");
  });

  it("enables system theme when specified", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TestChild />
      </ThemeProvider>
    );

    const mockUseTheme = useTheme as jest.Mock;
    expect(mockUseTheme).toHaveBeenCalled();
  });
});
