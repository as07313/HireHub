// app/candidate/dashboard/dashboard-client.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card" 
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Briefcase, Heart, Bell } from "lucide-react"
import { JobList } from "@/components/candidate/dashboard/job-list"
import { getUserProfile } from "@/app/actions/user"
import type { UserProfile } from "@/app/actions/user" // Add this import
import { getAppliedJobs } from "@/app/actions/applied-jobs"
import { BaseJob } from "@/app/types/job"

interface DashboardClientProps {
  initialData: UserProfile;
  appliedJobs: BaseJob[];  // Add this prop
}
export function DashboardClient({ initialData, appliedJobs }: DashboardClientProps) {
  const router = useRouter()
  const [userData, setUserData] = useState(initialData)
  const [searchQuery, setSearchQuery] = useState("")

  const jobs = appliedJobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.department,
    logo: '/company-placeholder.png',
    location: job.location,
    salary: `$${job.salary.min}-${job.salary.max}`,
    type: job.employmentType,
    postedDate: new Date(job.postedDate).toLocaleDateString(),
    status: job.status,
    appliedDate: job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : undefined
  })).slice(0, 5) // Get only the 5 most recent applications

  console.log("jobs",jobs)

  // Fetch recent applied jobs
  // useEffect(() => {
  //   const fetchRecentApplications = async () => {
  //     try {
  //       // Get token from localStorage
  //       const token = localStorage.getItem('token');
        
  //       const response = await fetch('/api/applications/candidate', {
  //         headers: {
  //           'Authorization': `Bearer ${token}` // Add token to headers
  //         }
  //       });
        
  //       if (!response.ok) throw new Error('Failed to fetch applications');
  //       const data = await response.json();
  //       setJobs(data.slice(0, 5)); // Get latest 5 applications
  //     } catch (error) {
  //       console.error('Error:', error);
  //     }
  //   };

  //   fetchRecentApplications();
  // }, []);

  if (!jobs) {
    return (
      <div>
        loading
        </div>
    )
  }

  function handleViewDetails(jobId: string): void {
    router.push(`/candidate/dashboard/applied/${jobId}`)
  }
  console.log("dashboard-job",jobs)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Hello, {userData?.fullName || 'User'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Here is your daily activities and job alerts
          </p>
        </div>
      </div>

      {/* Stats Cards */} 
      <div className="flex flex-row gap-4">
        <Card className="flex-1 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Applied Jobs
              </p>
              <h2 className="text-2xl font-bold">{userData?.stats.appliedJobs || 0}</h2>
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Saved Jobs
              </p>
              <h2 className="text-2xl font-bold">{userData?.stats.savedJobs || 0}</h2>
            </div>
          </div>
        </Card>
        {/* Other stat cards remain the same */}
      </div>

      {/* Profile Alert */}
      {!userData?.profileComplete && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Your profile editing is not completed.
              <br />
              <span className="text-sm opacity-70">
                Complete your profile 
              </span>
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={() => router.push('/candidate/profile/edit')}
            >
              Edit Profile
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Applications */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recently Applied</h2>
          <Button 
            variant="link"
            onClick={() => router.push('/candidate/dashboard/applied')}
          >
            View all
          </Button>
        </div>
        <JobList 
          jobs={jobs}
          type="applied"
          searchQuery={searchQuery}
          onViewDetails={handleViewDetails}
          showStatus={true}
        />
      </div>
    </div>
  )
}