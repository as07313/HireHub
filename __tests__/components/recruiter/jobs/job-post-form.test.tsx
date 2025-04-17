import { render, screen, fireEvent } from "@testing-library/react";
import { JobPostForm } from "@/components/recruiter/jobs/jobs-post-form";
import { useForm } from "react-hook-form";

// Mock options for select fields
const mockOptions = {
  departmentOptions: [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" }
  ],
  employmentTypes: [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" }
  ],
  experienceLevels: [
    { value: "entry", label: "Entry Level" },
    { value: "senior", label: "Senior Level" }
  ]
};

const MockJobPostForm = () => {
  const form = useForm({
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      salary: { min: "", max: "" },
      description: "",
      requirements: "",
      benefits: ""
    }
  });

  return (
    <JobPostForm
      form={form}
      onSubmit={jest.fn()}
      departmentOptions={mockOptions.departmentOptions}
      employmentTypes={mockOptions.employmentTypes}
      experienceLevels={mockOptions.experienceLevels}
      onCancel={jest.fn()}
      isSubmitting={false}
      activeTab="details"
      onTabChange={jest.fn()}
    />
  );
};

describe("JobPostForm", () => {
  it("renders basic job details form fields", () => {
    render(<MockJobPostForm />);
    expect(screen.getByPlaceholderText(/senior frontend developer/i)).toBeInTheDocument();
    expect(screen.getByText(/department/i)).toBeInTheDocument();
    expect(screen.getByText(/location/i)).toBeInTheDocument();
  });

  it("allows input in form fields", () => {
    render(<MockJobPostForm />);
    const titleInput = screen.getByPlaceholderText(/senior frontend developer/i);
    const locationInput = screen.getByPlaceholderText(/e\.g\. new york/i);
    
    fireEvent.change(titleInput, { target: { value: "Senior React Developer" } });
    fireEvent.change(locationInput, { target: { value: "San Francisco" } });

    expect(titleInput).toHaveValue("Senior React Developer");
    expect(locationInput).toHaveValue("San Francisco");
  });

  it("renders salary range fields", () => {
    render(<MockJobPostForm />);
    expect(screen.getByText(/minimum salary/i)).toBeInTheDocument();
    expect(screen.getByText(/maximum salary/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. 50000/i)).toBeInTheDocument();
  });

  it("renders job description textarea", () => {
    render(<MockJobPostForm />);
    const descriptionInput = screen.getByPlaceholderText(/describe the role/i);
    expect(descriptionInput).toBeInTheDocument();
    
    fireEvent.change(descriptionInput, { 
      target: { value: "We are looking for a skilled developer..." }
    });
    expect(descriptionInput).toHaveValue("We are looking for a skilled developer...");
  });
});