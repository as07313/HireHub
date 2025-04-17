import { render, screen } from "@testing-library/react";
import { AuthLayout } from "@/components/auth/auth-layout";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe("AuthLayout", () => {
  const mockTestimonial = {
    quote: "Test quote",
    author: "Test Author - Software Engineer",
  };

  const mockChildren = <div data-testid="test-children">Test Content</div>;

  it("renders children content", () => {
    render(
      <AuthLayout testimonial={mockTestimonial}>{mockChildren}</AuthLayout>
    );
    expect(screen.getByTestId("test-children")).toBeInTheDocument();
  });

  it("renders testimonial content", () => {
    render(
      <AuthLayout testimonial={mockTestimonial}>{mockChildren}</AuthLayout>
    );
    expect(screen.getByText(mockTestimonial.quote)).toBeInTheDocument();
    expect(screen.getByText(mockTestimonial.author)).toBeInTheDocument();
  });

  it("uses default testimonial when none provided", () => {
    render(<AuthLayout>{mockChildren}</AuthLayout>);
    expect(screen.getByText(/hirehub has transformed/i)).toBeInTheDocument();
  });

  it("renders background image", () => {
    render(<AuthLayout>{mockChildren}</AuthLayout>);
    const backgroundImage = screen.getByAltText("Authentication background");
    expect(backgroundImage).toBeInTheDocument();
    expect(backgroundImage).toHaveAttribute(
      "src",
      expect.stringContaining("unsplash")
    );
  });
});
