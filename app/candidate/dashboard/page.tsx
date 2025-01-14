// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Briefcase, Heart, Bell } from "lucide-react"
import { JobList } from "@/components/candidate/dashboard/job-list"
import { appliedJobs } from "@/lib/data/applied-jobs"

interface UserData {
  fullName: string;
  email: string;
  profileComplete: boolean;
  stats: {
    appliedJobs: number;
    favoriteJobs: number;
    jobAlerts: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  function handleViewDetails(jobId: string): void {
    router.push(`/candidate/applied/${jobId}`);
  }
  
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
              <h2 className="text-2xl font-bold">{userData?.stats.appliedJobs || 0}</h2>
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
              <h2 className="text-2xl font-bold">{userData?.stats.favoriteJobs || 0}</h2>
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
              <h2 className="text-2xl font-bold">{userData?.stats.jobAlerts || 0}</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Profile Alert - Show only if profile is incomplete */}
      {!userData?.profileComplete && (
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
            onClick={() => router.push('/candidate/applications')}
          >
            View all
          </Button>
        </div>
          <JobList 
          jobs={appliedJobs.slice(0, 5)} // Show only last 5 applications
          type="applied"
          searchQuery={searchQuery}
          onViewDetails={handleViewDetails}
          showStatus={true}
        />
      </div>
    </div>
  )
}