"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Briefcase, Heart, Bell, ArrowRight, CheckCircle } from "lucide-react"
import { JobList } from "@/components/candidate/dashboard/job-list"
import type { UserProfile } from "@/app/actions/user"
import { BaseJob, JobUI } from "@/app/types/job"
import { motion } from "framer-motion"

interface DashboardClientProps {
  initialData: UserProfile;
  appliedJobs: BaseJob[];
}

export function DashboardClient({ initialData, appliedJobs }: DashboardClientProps) {
  const router = useRouter()
  const [userData] = useState(initialData) // Removed setUserData as it's not used
  const [searchQuery] = useState("") // Keep state for JobList prop, removed setSearchQuery

  // Transform appliedJobs for JobList
  const recentJobs: JobUI[] = appliedJobs.map(job => ({
    id: job._id,
    title: job.title,
    company: job.department,
    logo: '/company-placeholder.png',
    location: job.location,
    salary: `$${job.salary.min}-${job.salary.max}`,
    type: job.employmentType,
    postedDate: new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    status: job.status,
    appliedDate: job.appliedDate ? new Date(job.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined,
  })).slice(0, 3) // Show only 3 recent applications for brevity

  function handleViewDetails(jobId: string): void {
    router.push(`/candidate/dashboard/applied/${jobId}`)
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} // Slightly reduced y
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }} // Faster duration
      className="space-y-6" // Reduced spacing
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-roboto"> {/* Reduced gap */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900"> {/* Reduced size */}
            Welcome back, {userData?.fullName || 'User'}!
          </h1>
          <p className="text-base text-gray-600"> {/* Reduced size and margin */}
            Here's your recruitment activity overview.
          </p>
        </div>
        <Button
          onClick={() => router.push('/candidate/dashboard/find-jobs')}
          size="lg" // Smaller button
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow transition-all px-4 py-2" // Adjusted style
        >
          Find New Jobs
          <ArrowRight className="ml-1.5 h-4 w-4" /> {/* Adjusted spacing */}
        </Button>
      </div>

      {/* Stats Cards - More Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Reduced gap */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg"> {/* Lighter border, subtle shadow */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4"> {/* Reduced padding */}
              <CardTitle className="text-sm font-medium text-muted-foreground">Applied Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" /> {/* Smaller icon */}
            </CardHeader>
            <CardContent className="p-4 pt-0"> {/* Reduced padding */}
              <div className="text-2xl font-bold text-gray-900">{userData?.stats.appliedJobs || 0}</div> {/* Reduced size */}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Saved Jobs</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-gray-900">{userData?.stats.savedJobs || 0}</div>
            </CardContent>
          </Card>
        </motion.div>

         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">Job Alerts</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-gray-900">0</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Profile Alert - More Subtle */}
      {!userData?.profileComplete ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Alert variant="default" className="border-yellow-200 bg-yellow-50/80 text-yellow-900 shadow-sm rounded-lg p-3"> {/* Reduced padding */}
            <AlertCircle className="h-4 w-4 text-yellow-600" /> {/* Smaller icon */}
            <AlertTitle className="font-medium text-sm mb-0.5">Complete Your Profile</AlertTitle> {/* Reduced size/margin */}
            <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs"> {/* Smaller text */}
              <span>
                Enhance your job matches by completing your profile details.
              </span>
              <Button
                variant="link" // Use link variant for less emphasis
                size="sm"
                className="mt-1 sm:mt-0 sm:ml-2 text-yellow-900 hover:text-yellow-700 h-auto p-0 text-xs" // Adjusted style
                onClick={() => router.push('/candidate/dashboard/settings')} // Corrected route
              >
                Go to Settings
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      ) : (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
           <Alert variant="default" className="border-green-200 bg-green-50/80 text-green-900 shadow-sm rounded-lg p-3">
             <CheckCircle className="h-4 w-4 text-green-600" />
             <AlertTitle className="font-medium text-sm mb-0.5">Profile Complete</AlertTitle>
             <AlertDescription className="text-xs">
               Your profile is up-to-date. Recruiters can find you easily!
             </AlertDescription>
           </Alert>
         </motion.div>
      )}

      {/* Recent Applications - Compact List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="border-slate-100 shadow-sm rounded-lg overflow-hidden">
           <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4"> {/* Reduced padding */}
             <div className="flex items-center justify-between">
               <CardTitle className="text-base font-semibold text-gray-800">Recent Applications</CardTitle> {/* Reduced size */}
               <Button
                 variant="link"
                 size="sm" // Smaller button
                 className="text-primary hover:text-primary/80 px-0 h-auto text-sm" // Adjusted style
                 onClick={() => router.push('/candidate/dashboard/applied')}
               >
                 View all
                 <ArrowRight className="ml-1 h-3 w-3" /> {/* Smaller icon */}
               </Button>
             </div>
           </CardHeader>
           <CardContent className="p-0"> {/* Remove padding */}
             {recentJobs.length > 0 ? (
               <JobList
                 jobs={recentJobs}
                 type="applied"
                 searchQuery={searchQuery}
                 onViewDetails={handleViewDetails}
                 showStatus={true}
                 compact={false} // Add a compact prop to JobList if possible for further size reduction
               />
             ) : (
                <div className="p-4 text-center text-sm text-gray-500"> {/* Reduced padding/size */}
                  You haven't applied for any jobs recently.
                </div>
             )}
           </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}