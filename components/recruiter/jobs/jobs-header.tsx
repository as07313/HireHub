"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function JobsHeader() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">My Jobs</h1>
        <p className="text-muted-foreground">
          Manage your job postings and view applicants
        </p>
      </div>
      <Button onClick={() => router.push("/recruiter/jobs/new")}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Post New Job
      </Button>
    </div>
  )
}