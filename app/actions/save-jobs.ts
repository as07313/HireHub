// app/actions/save-jobs.ts
"use server"

import { auth } from "@/app/middleware/auth"
import { Job, IJob } from "@/models/Job" 
import { Candidate } from "@/models/User"
import { revalidatePath } from "next/cache"
import connectToDatabase from "@/lib/mongodb"
import { Document, Types } from "mongoose"
import { BaseJob } from "@/app/types/job"

interface PopulatedDoc extends Document {
  savedJobs: PopulatedJob[];
}

interface PopulatedJob extends Document {
  _id: string;
  title: string;
  department: string;
  location: string;
  workplaceType: 'onsite' | 'hybrid' | 'remote';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'open' | 'closed';
  salary: {
    min: string;
    max: string;
  };
  experience: 'entry' | 'mid' | 'senior' | 'lead';
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: Date;
}

export async function getSavedJobs(): Promise<BaseJob[]> {
  await connectToDatabase();
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const user = await Candidate.findById(session.userId)
    .populate({
      path: 'savedJobs',
      model: Job,
      select: '-applicants'
    })
    .select('savedJobs')
    .lean<PopulatedDoc>();

  if (!user) return []

  // Transform to BaseJob array
  return user.savedJobs.map(job => ({
    _id: job._id.toString(),
    title: job.title,
    department: job.department,
    location: job.location,
    workplaceType: job.workplaceType,
    employmentType: job.employmentType,
    status: job.status === 'open' ? 'active' : 'closed',
    salary: {
      min: job.salary.min,
      max: job.salary.max
    },
    experience: job.experience,
    description: job.description,
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    skills: Array.isArray(job.skills) ? job.skills : [],
    postedDate: job.postedDate
  }))
}

// app/actions/save-jobs.ts
export async function saveJob(jobId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return {
        success: false,
        error: "Job not found"
      }
    }

    // Check if already saved
    const user = await Candidate.findById(session.userId)
    if (user?.savedJobs.includes(jobId)) {
      return {
        success: false,
        error: "Job already saved"
      }
    }

    // Save the job
    await Candidate.findByIdAndUpdate(session.userId, {
      $addToSet: { savedJobs: jobId }
    })

    revalidatePath('/candidate/dashboard/saved')
    
    return {
      success: true
    }

  } catch (error) {
    console.error('Error saving job:', error)
    return {
      success: false,
      error: "Failed to save job"
    }
  }
}

export async function removeSavedJob(jobId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      return {
        success: false,
        error: "Unauthorized"
      }
    }

    // Check if job exists in saved jobs
    const user = await Candidate.findById(session.userId)
    if (!user?.savedJobs.includes(jobId)) {
      return {
        success: false,
        error: "Job not found in saved jobs"
      }
    }

    // Remove the job
    await Candidate.findByIdAndUpdate(session.userId, {
      $pull: { savedJobs: jobId }
    })

    revalidatePath('/candidate/dashboard/saved')
    
    return {
      success: true
    }

  } catch (error) {
    console.error('Error removing saved job:', error)
    return {
      success: false,
      error: "Failed to remove saved job"
    }
  }
}