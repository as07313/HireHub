// app/candidate/dashboard/applied/[jobId]/page.tsx
import { Suspense } from "react"
import { notFound } from 'next/navigation'
import { JobDetails } from "@/components/candidate/jobs/job-details"
import { SkillsRecommendation } from "@/components/candidate/jobs/skills-recommendation"
import { getAppliedJob } from "@/app/actions/applied-jobs"

interface PageProps {
  params: Promise<{
    jobId: string
  }>
}

export default async function AppliedJobDetailsPage({
  params,
}: PageProps) {
  const { jobId } = await params
  const job = await getAppliedJob(jobId)

  if (!job) {
    notFound()
  }

  const transformedJob = {
    id: job._id,
    recruiterId: '',
    title: job.title,
    department: job.department,
    location: job.location,
    workplaceType: job.workplaceType,
    employmentType: job.employmentType,
    status: job.status,
    salary: {
      min: job.salary.min,
      max: job.salary.max
    },
    experience: job.experience,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    skills: job.skills,
    postedDate: job.postedDate,
    logo: '/company-placeholder.png',
    company: job.department,
    companyDescription: ''
  }

  return (
    <div className="container max-w-6xl py-8">
      <Suspense fallback={<div>Loading job details...</div>}>
        <JobDetails 
          job={transformedJob}
          backLink="/candidate/dashboard/applied"
          backLabel="Back to Applied Jobs"
          showActions={false}
          showApplyButton={false}
        />
      </Suspense>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Suspense fallback={<div>Loading recommendations...</div>}>
            <SkillsRecommendation 
              jobSkills={job.skills}    
              candidateSkills={[]} // TODO: Fetch from user profile
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}