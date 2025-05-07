// app/recruiter/jobs/new/page.tsx
"use client"

import { memo, useCallback, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { JobPostForm } from "@/components/recruiter/jobs/jobs-post-form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Briefcase, Clock, PlusCircle, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "operations", label: "Operations" },
  { value: "customer-service", label: "Customer Service" },
  { value: "other", label: "Other" }
] as const

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full Time" },
  { value: "part-time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "temporary", label: "Temporary" },
  { value: "remote", label: "Remote" }
] as const

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead/Manager" },
  { value: "executive", label: "Executive" }
] as const

export default function NewJobPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  
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
      setIsSubmitting(true)
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
    } finally {
      setIsSubmitting(false)
    }
  }, [router])

  return (
    <div className="container  py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-2 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">
            Create a compelling job listing to attract the right candidates
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-primary/10 p-3 rounded-full">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Fill out the information below to create your new job posting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Basic Details
              </TabsTrigger>
              <TabsTrigger value="description" className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Description
              </TabsTrigger>
              <TabsTrigger value="requirements" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Requirements & Benefits
              </TabsTrigger>
            </TabsList>
            
            <JobPostForm
              form={form}
              onSubmit={onSubmit}
              departmentOptions={DEPARTMENT_OPTIONS}
              employmentTypes={EMPLOYMENT_TYPES}
              experienceLevels={EXPERIENCE_LEVELS}
              onCancel={() => router.back()}
              isSubmitting={isSubmitting}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center text-muted-foreground text-sm">
        <p>Need help writing an effective job post? 
          <Button variant="link" className="pl-1 h-auto p-0">
            View our guide
          </Button>
        </p>
      </div>
    </div>
  )
}