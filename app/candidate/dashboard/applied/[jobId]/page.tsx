// app/candidate/dashboard/applied/[jobId]/page.tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { JobDetails } from "@/components/candidate/jobs/job-details";
import { SkillsRecommendation } from "@/components/candidate/jobs/skills-recommendation";
import { getAppliedJob } from "@/app/actions/applied-jobs";
import { auth } from "@/app/middleware/auth";
import SkillAnalysis from "@/models/Analysis";
import connectToDatabase from "@/lib/mongodb";

interface PageProps {
  params: Promise<{
    jobId: string;
  }>;
}

// Update the interface to match the actual structure
interface SkillAnalysisResult {
  skill_gaps: {
    content: string;
  };
  course_recommendations: {
    content: string;
  };
}

// Fixed the parameter list to match how it's called
async function getSkillAnalysis(jobId: string, jobDescription: string, resumeFilePath: string): Promise<SkillAnalysisResult> {
  await connectToDatabase();

  // Check for existing analysis
  const existingAnalysis = await SkillAnalysis.findOne({
    jobId: jobId,
  });
  
  if (existingAnalysis) {
    console.log("Existing analysis found:", existingAnalysis.result);
    return existingAnalysis.result;
  }
  
  console.log("No existing analysis found, creating a new one.");

  // Call the external API to get the skill analysis
  const res = await fetch("https://hirehub-api-795712866295.europe-west4.run.app/api/analyze-skills", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      job_description: jobDescription, 
      file_path: resumeFilePath 
    }),
  });

  if (!res.ok) throw new Error("Failed to call the external API");

  const data = await res.json();
  console.log("API response:", data);
  
  // Save the analysis result to the database
  const result = {
    skill_gaps: data.skill_gaps,
    course_recommendations: data.course_recommendations,
  };
  
  const newAnalysis = new SkillAnalysis({
    jobId: jobId,
    filePath: resumeFilePath,
    result: result,
  });

  await newAnalysis.save();
  console.log("New analysis saved:", newAnalysis.result);

  // Return the properly structured result
  return result;
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

  const apiResult = await getSkillAnalysis(jobId, job.description, transformedFilename);
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
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}