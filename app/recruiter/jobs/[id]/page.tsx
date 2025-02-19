import { Suspense } from "react"
import { JobDetailsClient } from "./jobs-detail-client"
import { findJobById } from "@/app/actions/find-jobs"
import { getJobApplicants } from "@/app/actions/recruiter/get-applicants"
import { Job } from "@/app/types/job"

interface PageProps {
  params:Promise<{
    id: string
  }>
}

interface JobApplicant {
  id: string
  name: string
  email: string
  avatar: string
  phone: string
  skills: string[]
  experience: string
  stage: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected'
  jobFitScore: number
  appliedDate: string
  location: string
  currentRole?: string
  company?: string
  interviews?: Array<{
    scheduledDate: Date
    type: 'technical' | 'hr' | 'cultural' | 'final'
    status: 'scheduled' | 'completed' | 'cancelled'
    feedback?: string
  }>
}

// Remove "use client" so it can run server-side
export default async function JobPage({ params }: PageProps) {
  const { id } = await params
  const [baseJob, applicants] = await Promise.all([
    findJobById(id),
    getJobApplicants(id),
  ])
  console.log(applicants)

  if (!baseJob) {
    return <div>Job not found</div>
  }

  const job: Job = {
    id: baseJob._id.toString(),
    title: baseJob.title,
    department: baseJob.department,
    location: baseJob.location,
    type: baseJob.employmentType,
    status: baseJob.status,
    applicants: applicants.length,
    postedDate: baseJob.postedDate.toISOString(),
    salary: baseJob.salary.min + ' - ' + baseJob.salary.max,
    description: baseJob.description,
    requirements: baseJob.requirements,
    benefits: baseJob.benefits
  }

  const mappedApplicants: JobApplicant[] = applicants.map(applicant => ({
    id: applicant.id,
    name: applicant.name,
    avatar: 'https://i.pravatar.cc/150',
    email: applicant.email,
    phone: applicant.phone || '',
    skills: applicant.skills || [],
    experience: applicant.experience || '',
    stage: applicant.stage || 'new',
    jobFitScore: applicant.jobFitScore || 0,
    appliedDate: applicant.appliedDate,
    location: '',
    interviews: applicant.interviews?.map(interview => ({
      scheduledDate: new Date(interview.scheduledDate), // Convert string to Date
      type: interview.type,
      status: interview.status,
      feedback: interview.feedback,
      // Remove interviewer as it's not needed in the UI
    })) || []
  }))

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobDetailsClient
        job={job}
        applicants={mappedApplicants}
      />
    </Suspense>
  )
}