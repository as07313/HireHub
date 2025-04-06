"use client"

import { useEffect, useState, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation" // Add useParams
import { JobPostForm } from "@/components/recruiter/jobs/jobs-post-form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Briefcase, Clock, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Same schema as the new job page
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

// Constants for form options (same as new job page)
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

export default function EditJobPage() {
  const router = useRouter()
  const params = useParams() // Use useParams hook instead
  const jobId = params?.id ? String(params.id) : null  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(true)
  
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

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return; // Ensure jobId exists
      
      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch job details')
        }

        const job = await response.json()
        
        // Format the job data for the form
        form.reset({
          title: job.title || "",
          department: job.department || "",
          location: job.location || "",
          type: job.employmentType || "",
          experience: job.experience || "",
          salary: {
            min: job.salary?.min || "",
            max: job.salary?.max || "",
          },
          description: job.description || "",
          requirements: job.requirements?.join('\n') || "",
          benefits: job.benefits?.join('\n') || "",
        })
      } catch (error) {
        toast.error("Failed to load job details")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, form])

  const onSubmit = useCallback(async (values: z.infer<typeof jobPostSchema>) => {
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to update job')
      }

      toast.success("Job updated successfully!")
      router.push(`/recruiter/jobs/${jobId}`)
    } catch (error) {
      toast.error("Failed to update job")
    } finally {
      setIsSubmitting(false)
    }
  }, [jobId, router])

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="mb-2 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job
          </Button>
          <h1 className="text-3xl font-bold">Edit Job</h1>
          <p className="text-muted-foreground">
            Update your job posting details
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
          <CardTitle>Edit Job Details</CardTitle>
          <CardDescription>
            Make changes to your job posting
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
    </div>
  )
}