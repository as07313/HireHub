"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Users, Calendar, MapPin, DollarSign, BarChart } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog" // Assuming you have a Dialog component from your UI library
import { Skeleton } from "@/components/ui/skeleton" // Assuming you have a Skeleton component for loading states

interface JobsListProps {
  searchQuery: string
  statusFilter: string
}

// Mock data - Replace with actual API data
const jobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    salary: "$120k-150k/year",
    status: "active",
    applicants: 45,
    description: "We are looking for a Senior Frontend Developer to join our team with experience in React, Next.js, and Tailwind CSS.",
    postedDate: "2024-03-15",
    applicantStats: {
      total: 45,
      qualified: 32,
      interviewing: 8,
      offered: 2
    }
  },
  {
    id: "2",
    title: "Product Designer",
    department: "Design",
    location: "New York, NY",
    salary: "$90k-120k/year",
    status: "active",
    description: "We are seeking a Product Designer with experience in Figma, Adobe Creative Suite, and prototyping tools.",
    applicants: 28,
    postedDate: "2024-03-14",
    applicantStats: {
      total: 28,
      qualified: 20,
      interviewing: 5,
      offered: 1
    }
  }
]

const statusStyles = {
  active: "bg-green-100 text-green-800",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
  draft: "bg-gray-100 text-gray-800"
}

export function JobsList({ searchQuery, statusFilter }: JobsListProps) {
  const router = useRouter()
  const [matchedCandidates, setMatchedCandidates] = useState<{ [key: string]: any }>({})
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null) // State to store the selected candidate for the modal
  const [isModalOpen, setIsModalOpen] = useState(false) // State to manage modal visibility
  const [loadingJobs, setLoadingJobs] = useState<{ [key: string]: boolean }>({}) // State to track loading status for each job

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  async function matchJD(description: string, jobId: string) {
    setLoadingJobs(prev => ({ ...prev, [jobId]: true })) // Set loading state for this job
    try {
      const response = await fetch("https://hirehub-api-795712866295.europe-west4.run.app/api/match-job-description", {
        method: "POST",
        body: JSON.stringify({ description }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      setMatchedCandidates(prev => ({ ...prev, [jobId]: data }))
    } catch (error) {
      console.error("Error fetching matched candidates:", error)
    } finally {
      setLoadingJobs(prev => ({ ...prev, [jobId]: false })) // Reset loading state for this job
    }
  }

  // Function to open the modal with candidate details
  const openCandidateModal = (candidate: any) => {
    setSelectedCandidate(candidate)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-4">
      {filteredJobs.map((job) => (
        <Card key={job.id} className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">{job.title}</h3>
                  <Badge 
                    variant="secondary"
                    className={statusStyles[job.status as keyof typeof statusStyles]}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Posted {job.postedDate}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Total Applicants</p>
                    <p className="text-2xl font-semibold">{job.applicantStats.total}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Qualified</p>
                    <p className="text-2xl font-semibold">{job.applicantStats.qualified}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
            <Button 
                variant="default"
                className="w-full lg:w-auto"
                onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
              >
                View Details
              </Button>
              <Button 
                variant="outline" 
                className="w-full lg:w-auto"
                onClick={() => matchJD(job.description, job.id)}
                disabled={loadingJobs[job.id]} // Disable button while loading
              >
                {loadingJobs[job.id] ? "Loading..." : "Find Applicants"}
              </Button>
            </div>
          </div>

          {loadingJobs[job.id] && (
            <div className="mt-6 space-y-4">
              <Skeleton className="h-8 w-1/2" /> {/* Loading placeholder for the table header */}
              <div className="space-y-2">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="h-12 w-full" /> // Loading placeholder for table rows
                ))}
              </div>
            </div>
          )}

          {matchedCandidates[job.id] && !loadingJobs[job.id] && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Matched Candidates</h4>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Soft Skills Score</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {matchedCandidates[job.id].candidates.map((candidate: any) => (
                    <tr key={candidate.candidate_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.candidate_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.total_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.technical_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.experience_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.education_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.soft_skills_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openCandidateModal(candidate)}
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      ))}

      {/* Modal for displaying candidate details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
            <DialogDescription>
              Detailed analysis of the candidate's strengths and areas for improvement.
            </DialogDescription>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Analysis</h4>
                <p className="text-sm text-muted-foreground">{selectedCandidate.analysis}</p>
              </div>
              <div>
                <h4 className="font-semibold">Strengths</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {selectedCandidate.strengths.map((strength: string, index: number) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Improvements</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {selectedCandidate.improvements.map((improvement: string, index: number) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
