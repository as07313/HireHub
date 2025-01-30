// app/candidate/dashboard/applied/[jobId]/page.tsx
import { Suspense } from "react"
import { notFound } from 'next/navigation'
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { SkillsRecommendation } from "@/components/candidate/jobs/skills-recommendation"
import { Job } from "@/models/Job"
import { Applicant } from "@/models/Applicant"
import { auth } from "@/app/middleware/auth"
import connectToDatabase from "@/lib/mongodb"

interface PageProps {
  params: Promise<{
    jobId: string
  }>
}

async function getAppliedJob(jobId: string) {
  await connectToDatabase()
  
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const application = await Applicant.findOne({
    jobId,
    candidateId: session.userId
  }).populate({
    path: 'jobId',
    model: Job
  })
  console.log(application)
  if (!application) {
    return null
  }

  return application
}

export default async function AppliedJobDetailsPage({
  params,
}: PageProps) {
  const { jobId } = await params // Await the params Promise
  console.log("jobid", jobId)
  const application = await getAppliedJob(jobId)

  if (!application) {
    notFound()
  }

  const job = {
    id: application.jobId._id.toString(),
    recruiterId: application.jobId.recruiterId.toString(),
    title: application.jobId.title,
    department: application.jobId.department,
    location: application.jobId.location,
    workplaceType: application.jobId.workplaceType,
    employmentType: application.jobId.employmentType,
    status: application.status,
    salary: {
      min: application.jobId.salary.min,
      max: application.jobId.salary.max
    },
    experience: application.jobId.experience,
    description: application.jobId.description,
    requirements: application.jobId.requirements,
    benefits: application.jobId.benefits,
    skills: application.jobId.skills,
    postedDate: application.jobId.postedDate,
    logo: '/company-placeholder.png',
    company: application.jobId.department,
    companyDescription: ''
  }

  return (
    <div className="container max-w-6xl py-8">
      <JobDetails 
        job={job}
        backLink="/candidate/dashboard/applied"
        backLabel="Back to Applied Jobs"
        showActions={false}
        showApplyButton={false}
      />
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <SkillsRecommendation 
            jobSkills={job.skills}    
            candidateSkills={[]} // Fetch from user profile
          />
        </div>
      </div>
    </div>
  )
}