import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../../components/ui/card";

describe("Card", () => {
  it("renders basic card with content", () => {
    render(
      <Card>
        <CardContent>Test Content</CardContent>
      </Card>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Content").closest("div")).toHaveClass(
      "rounded-lg border"
    );
  });

  it("renders full card structure", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Main Content</CardContent>
        <CardFooter>Footer Content</CardFooter>
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeInTheDocument();
    expect(screen.getByText("Card Description")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
  });

  it("applies custom className to card components", () => {
    render(
      <Card className="custom-card">
        <CardHeader className="custom-header">
          <CardTitle className="custom-title">Title</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(
      screen.getByText("Title").closest(".custom-title")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Title").closest(".custom-header")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Title").closest(".custom-card")
    ).toBeInTheDocument();
  });

  it("renders card with only header", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Header Only Card</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText("Header Only Card")).toBeInTheDocument();
  });

  it("renders card with only footer", () => {
    render(
      <Card>
        <CardFooter>Footer Only Card</CardFooter>
      </Card>
    );
    expect(screen.getByText("Footer Only Card")).toBeInTheDocument();
  });

  it("supports nested content structure", () => {
    render(
      <Card>
        <CardContent>
          <div data-testid="nested-div">
            <span>Nested Content</span>
          </div>
        </CardContent>
      </Card>
    );

    expect(screen.getByTestId("nested-div")).toBeInTheDocument();
    expect(screen.getByText("Nested Content")).toBeInTheDocument();
  });
});
