"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Briefcase, Heart, Bell } from "lucide-react"
import { JobList } from "@/components/dashboard/job-list"

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hello, Vania Imran</h1>
          <p className="text-sm text-muted-foreground">
            Here is your daily activities and job alerts
          </p>
        </div>
      </div>

      {/* Stats */}
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
              <h2 className="text-2xl font-bold">589</h2>
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Favorite Jobs
              </p>
              <h2 className="text-2xl font-bold">238</h2>
            </div>
          </div>
        </Card>
        <Card className="flex-1 p-6">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <Bell className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                Job Alerts
              </p>
              <h2 className="text-2xl font-bold">574</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Alert */}
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Your profile editing is not completed.
            <br />
            <span className="text-sm opacity-70">
              Complete your profile editing & build your custom Resume
            </span>
          </span>
          <Button variant="outline" size="sm" className="ml-4">
            Edit Profile
          </Button>
        </AlertDescription>
      </Alert>

      {/* Recent Applications */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recently Applied</h2>
          <Button variant="link">View all</Button>
        </div>
        <JobList searchQuery={searchQuery} type="applied" />
      </div>
    </div>
  )
}