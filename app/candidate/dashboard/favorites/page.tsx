// app/candidate/dashboard/favorites/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { JobList } from "@/components/candidate/dashboard/job-list"

// Mock data - Replace with actual API data
const favoriteJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    location: "Remote",
    salary: "$120k-150k/year",
    type: "Full Time",
    postedDate: "2024-03-15",
    savedDate: "2024-03-16"
  },
  // Add more favorite jobs as needed
]

export default function FavoritesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleRemoveFromFavorites = (jobId: string) => {
    // Implement remove from favorites logic
    console.log("Remove from favorites:", jobId)
  }

  return (
    <div className="container max-w-6xl py-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Favorite Jobs</h1>
        <p className="text-muted-foreground">
          Jobs you've marked as favorites
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search favorite jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Job List */}
      <JobList 
        jobs={favoriteJobs}
        type="saved"
        searchQuery={searchQuery}
        onViewDetails={(id) => router.push(`/candidate/dashboard/favorites/${id}`)}
        onAction={(id) => handleRemoveFromFavorites(id)}
        actionLabel="Remove"
        showStatus={false}
      />
    </div>
  )
}