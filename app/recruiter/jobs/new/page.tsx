// app/recruiter/jobs/new/page.tsx
"use client"

import { memo, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { JobPostForm } from "@/components/recruiter/jobs/jobs-post-form"
import { toast } from "sonner"

// Move schema outside component to prevent recreation
const jobPostSchema = z.object({
  title: z.string().min(2, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(2, "Location is required"),
  type: z.string().min(1, "Employment type is required"),
  experience: z.string().min(1, "Experience level is required"),
  salary: z.object({
    min: z.string().min(1, "Minimum salary is required"),
    max: z.string().min(1, "Maximum salary is required"),
  }),
  description: z.string().min(10, "Job description must be at least 10 characters"),
  requirements: z.string().min(10, "Job requirements must be at least 10 characters"),
  benefits: z.string().min(10, "Benefits must be at least 10 characters"),
})

// Constants for form options
const DEPARTMENT_OPTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "design", label: "Design" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" }
] as const

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" }
] as const

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead/Manager" }
] as const

export default function NewJobPage() {
  const router = useRouter()
  
  const form = useForm<z.infer<typeof jobPostSchema>>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      salary: {
        min: "",
        max: "",
      },
      description: "",
      requirements: "",
      benefits: "",
    },
  })

  const onSubmit = useCallback(async (values: z.infer<typeof jobPostSchema>) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/jobs/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to create job')
      }

      toast.success("Job posted successfully!")
      router.push("/recruiter/jobs")
    } catch (error) {
      toast.error("Failed to post job")
    }
  }, [router])

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Post a New Job</h1>
        <p className="text-muted-foreground">Create a new job listing</p>
      </div>

      <JobPostForm
        form={form}
        onSubmit={onSubmit}
        departmentOptions={DEPARTMENT_OPTIONS}
        employmentTypes={EMPLOYMENT_TYPES}
        experienceLevels={EXPERIENCE_LEVELS}
        onCancel={() => router.back()}
      />
    </div>
  )
}