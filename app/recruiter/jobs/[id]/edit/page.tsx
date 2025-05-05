"use client"

import { useEffect, useState, useCallback } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter, useParams } from "next/navigation"
import { JobPostForm } from "@/components/recruiter/jobs/jobs-post-form"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Briefcase, Clock, Bookmark, Power, PowerOff, Loader2, Trash2, AlertTriangle } from "lucide-react" // Added Trash2, AlertTriangle
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" // Import AlertDialog components

// ... (jobPostSchema and constants remain the same) ...
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
  const params = useParams()
  const jobId = params?.id ? String(params.id) : null
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false) // State for delete operation
  const [activeTab, setActiveTab] = useState("details")
  const [isLoading, setIsLoading] = useState(true)
  const [currentStatus, setCurrentStatus] = useState<'open' | 'closed' | string>('open')

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
      if (!jobId) {
        setIsLoading(false); // Stop loading if no jobId
        toast.error("Job ID not found.");
        router.push('/recruiter/jobs'); // Redirect if no ID
        return;
      };

      try {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        const response = await fetch(`/api/jobs/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          if (response.status === 404) {
            toast.error("Job not found.");
            router.push('/recruiter/jobs'); // Redirect if job doesn't exist
          } else {
            throw new Error('Failed to fetch job details');
          }
          return; // Stop execution if job not found or error occurred
        }

        const job = await response.json()

        // Set form values
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
        setCurrentStatus(job.status || 'open')

      } catch (error) {
        toast.error("Failed to load job details")
        console.error(error)
        // Optionally redirect on generic error too
        // router.push('/recruiter/jobs');
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId, form, router]) // Added router to dependency array

  // Handler for submitting form updates
  const onSubmit = useCallback(async (values: z.infer<typeof jobPostSchema>) => {
    if (!jobId) return;
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...values, status: currentStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update job details')
      }

      toast.success("Job details updated successfully!")
      // No redirect here, stay on the edit page after saving changes
    } catch (error) {
      toast.error("Failed to update job details")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }, [jobId, currentStatus]) // Removed router from dependency array

  // Handler for toggling job status
  const handleStatusToggle = async () => {
    if (!jobId) return;

    const newStatus = currentStatus === 'closed' ? 'open' : 'closed';
    setIsTogglingStatus(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${newStatus === 'closed' ? 'close' : 'reopen'} job`);
      }

      setCurrentStatus(newStatus);
      toast.success(`Job successfully ${newStatus === 'closed' ? 'closed' : 'reopened'}.`);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
      console.error("Status toggle error:", error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  // Handler for deleting the job
  const handleDeleteJob = async () => {
    if (!jobId) return;
    setIsDeleting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete job');
      }

      toast.success('Job deleted successfully!');
      router.push('/recruiter/jobs'); // Redirect to jobs list after deletion

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred while deleting.');
      console.error("Delete job error:", error);
      setIsDeleting(false); // Ensure loading state is reset on error
    }
    // No finally block needed here as redirect happens on success
  };


  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="ml-3 text-lg text-muted-foreground">Loading job details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      {/* ... Back Button and Header ... */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-2 -ml-2 text-muted-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <Badge
              variant={currentStatus === 'closed' ? 'destructive' : 'default'}
              className={currentStatus === 'closed' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
            >
              {currentStatus === 'closed' ? 'Closed' : 'Open'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Update your job posting details or change its status.
          </p>
        </div>
        {/* Optional Icon */}
      </div>


      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"> {/* Added gap */}
            <div>
              <CardTitle>Edit Job Details</CardTitle>
              <CardDescription>
                Make changes to your job posting. Use the buttons for status or deletion.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2"> {/* Wrapper for buttons */}
              <Button
                variant={currentStatus === 'closed' ? 'outline' : 'destructive'}
                size="sm"
                onClick={handleStatusToggle}
                disabled={isTogglingStatus || isSubmitting || isDeleting} // Disable if any action is running
                className="w-full sm:w-auto"
              >
                {isTogglingStatus ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : currentStatus === 'closed' ? (
                  <Power className="mr-2 h-4 w-4" />
                ) : (
                  <PowerOff className="mr-2 h-4 w-4" />
                )}
                {isTogglingStatus
                  ? 'Updating...'
                  : currentStatus === 'closed'
                  ? 'Reopen Job'
                  : 'Close Job'}
              </Button>

              {/* Delete Button Trigger */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto"
                    disabled={isTogglingStatus || isSubmitting || isDeleting} // Disable if any action is running
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Job
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="text-destructive h-5 w-5" /> Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the job posting and all associated applicant data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteJob}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      {isDeleting ? 'Deleting...' : 'Yes, delete job'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* ... Tabs and JobPostForm ... */}
           <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 grid w-full grid-cols-3">
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