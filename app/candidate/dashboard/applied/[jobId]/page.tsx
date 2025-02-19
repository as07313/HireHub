// app/candidate/dashboard/applied/[jobId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { JobDetails } from "@/components/candidate/jobs/job-details";
import { SkillsRecommendation } from "@/components/candidate/jobs/skills-recommendation";
import { getAppliedJob } from "@/app/actions/applied-jobs";
import { auth } from "@/app/middleware/auth";
import { cache } from "react";

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

// Cache applicant details API response
const getCachedApplicantDetails = cache(async (jobId: string, userId: string) => {
  const res = await fetch(`https://hirehub-lime.vercel.app/api/applicantDetails?jobId=${jobId}&candidateId=${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch applicant details");

  return res.json();
});

// Cache AI analysis API response
const getCachedSkillAnalysis = cache(async (jobDescription: string, filePath: string) => {
  const res = await fetch("https://hirehub-api-795712866295.europe-west4.run.app/api/analyze-skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_description: jobDescription, file_path: filePath }),
  });

  if (!res.ok) throw new Error("Failed to call the external API");

  return res.json();
});

export default async function AppliedJobDetailsPage({ params }: PageProps) {
  const { jobId } = await params;
  const job = await getAppliedJob(jobId);

  const session = await auth();

  if (!job) {
    notFound();
  }

  if (!session) {
    notFound();
  }

  const { filename } = await getCachedApplicantDetails(jobId, session.userId);
  console.log("Original Resume filename:", filename);

  const transformedFilename = `parsed/${filename.replace(/\.[^/.]+$/, "")}.md`;
  console.log("Transformed Resume filename:", transformedFilename);

  const apiResult = await getCachedSkillAnalysis(job.description, transformedFilename);
  console.log("API Result:", apiResult);


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
          <Suspense fallback={<div>Loading recommendations...</div>}>
          <SkillsRecommendation
            skillGaps={apiResult.skill_gaps}
            courseRecommendations={apiResult.course_recommendations}
            //jobSkills={job.skills}
          />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
