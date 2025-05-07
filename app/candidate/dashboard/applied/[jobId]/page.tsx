// app/candidate/dashboard/applied/[jobId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { JobDetails } from "@/components/candidate/jobs/job-details";
import { SkillsRecommendation } from "@/components/candidate/jobs/skills-recommendation";
import { getAppliedJob } from "@/app/actions/applied-jobs";
import { auth } from "@/app/middleware/auth";
import SkillAnalysis from "@/models/Analysis";
import connectToDatabase from "@/lib/mongodb";
import { SkillAnalysisSection } from "@/components/candidate/jobs/skill-analysis-section"; // Import the new component


interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function AppliedJobDetailsPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = await getAppliedJob(jobId);
  console.log("applied job:", job);

  const session = await auth();

  if (!job) {
    notFound();
  }

  if (!session) {
    notFound();
  }

  const filename = job.resumeFilename || '';
  const transformedFilename = `parsed/${filename.replace(/\.[^/.]+$/, "")}.md`;
  console.log("Transformed Resume filename:", transformedFilename);


  const transformedJob = {
    id: job._id,
    recruiterId: "",
    title: job.title,
    department: job.department,
    location: job.location,
    workplaceType: job.workplaceType,
    employmentType: job.employmentType,
    status: job.status,
    salary: {
      min: job.salary.min,
      max: job.salary.max,
    },
    experience: job.experience,
    description: job.description,
    requirements: job.requirements,
    benefits: job.benefits,
    skills: job.skills,
    postedDate: job.postedDate,
    logo: "/company-placeholder.png",
    company: job.department,
    companyDescription: "",
  };

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
        <div className="lg:col-span-2 space-y-6">
           {/* Pass necessary props for the API call */}
           <SkillAnalysisSection
             jobId={jobId}
             jobDescription={job.description}
             resumeFilePath={transformedFilename}
           />
        </div>
        </div>
      </div>
    </div>
  );
}