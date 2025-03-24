import { Suspense } from "react"
import { JobDetailsClient } from "./jobs-detail-client"
import { findJobById } from "@/app/actions/find-jobs"
import { getJobApplicants } from "@/app/actions/recruiter/get-applicants"
import { Job } from "@/app/types/job"
import { JobApplicant } from "@/app/types/applicant"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function JobPage({ params }: PageProps) {
  const { id } = await params
  const [baseJob, applicants] = await Promise.all([
    findJobById(id),
    getJobApplicants(id),
  ])

  console.log('Fetched applicants:', applicants.length, applicants)
  if (!baseJob) {
    return <div>Job not found</div>
  }

  // Format dates consistently on server
  const job: Job = {
    id: baseJob._id.toString(),
    title: baseJob.title,
    department: baseJob.department,
    location: baseJob.location,
    type: baseJob.employmentType,
    status: baseJob.status,
    applicants: applicants.length,
    postedDate: baseJob.postedDate.toISOString(),
    salary: `${baseJob.salary.min} - ${baseJob.salary.max}`,
    description: baseJob.description,
    requirements: baseJob.requirements || [],
    benefits: baseJob.benefits || []
  }

  // Map data to JobApplicant interface
  const mappedApplicants: JobApplicant[] = applicants.map(applicant => ({
    id: applicant.id,
    name: applicant.name,
    email: applicant.email,
    avatar: 'https://i.pravatar.cc/150',
    phone: applicant.phone || '',
    skills: applicant.skills || [],
    experience: applicant.experience || '',
    stage: applicant.stage || 'new', // Map status to stage
    jobFitScore: applicant.jobFitScore || 0,
    appliedDate: new Date(applicant.appliedDate).toISOString(),
    company: applicant.company,
    aiAnalysis: applicant.aiAnalysis || {
      technicalSkills: {
        score: 0,
        strengths: [],
        gaps: []
      },
      experience: {
        score: 0,
        strengths: [],
        gaps: []
      },
      education: {
        score: 0,
        strengths: [],
        gaps: []
      }
    },
    resume: applicant.resume ? {
      id: String(applicant.resume.id),
      fileName: applicant.resume.fileName || '',
      filePath: applicant.resume.filePath || '',
      uploadDate: applicant.resume.uploadDate.toString()
    } : null,
    interviews: applicant.interviews?.map(interview => ({
      scheduledDate: new Date(interview.scheduledDate).toString(),
      type: interview.type,
      status: interview.status,
      feedback: interview.feedback || ''
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