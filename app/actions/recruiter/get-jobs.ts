"use server"

import { auth } from "@/app/middleware/auth"
import { Job } from "@/models/Job"
import { Applicant } from "@/models/Applicant"
import connectToDatabase from "@/lib/mongodb"
import { Types } from "mongoose"

// Define interface for applicant stats from aggregation
interface ApplicantStat {
  _id: Types.ObjectId;
  total: number;
  qualified: number;
}

// Define interface for job document from MongoDB
type JobDocument = {
  _id: Types.ObjectId;
  recruiterId: Types.ObjectId | string;
  title: string;
  department: string;
  location: string;
  workplaceType: string;
  employmentType: string;
  status: string;
  salary?: {
    min: string;
    max: string;
  };
  experience: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  postedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

// Single interface for serialized job data
interface SerializedJob {
  id: string;
  recruiterId: string;
  title: string;
  department: string;
  location: string;
  workplaceType: string;
  employmentType: string;
  status: string;
  salary: {
    min: string;
    max: string;
  };
  experience: string;
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  applicantStats: {
    total: number;
    qualified: number;
  };
}

export async function getJobs(): Promise<SerializedJob[]> {
  await connectToDatabase()
  
  const session = await auth()
  if (!session || session.type !== 'recruiter') {
    throw new Error("Unauthorized")
  }

  try {
    // Get basic job information with correct typing
    const jobs = await Job.find({ 
      recruiterId: session.userId 
    })
    .sort({ postedDate: -1 })
    .lean<JobDocument[]>()
    
    // Simply use the _id values directly - MongoDB can work with these without conversion
    const jobIds = jobs.map(job => job._id)
    
    // Batch fetch applicant stats for all jobs
    const applicantCounts = await Applicant.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: {
          _id: "$jobId",
          total: { $sum: 1 },
          qualified: { $sum: { $cond: [{ $gte: ["$jobFitScore", 70] }, 1, 0] } }
        }
      }
    ]) as ApplicantStat[];

    // Create a map for quick lookup
    const applicantStatsMap: Record<string, { total: number; qualified: number }> = {}
    applicantCounts.forEach(stat => {
      applicantStatsMap[stat._id.toString()] = {
        total: stat.total,
        qualified: stat.qualified
      }
    })

    // Transform MongoDB documents to SerializedJob objects
    const serializedJobs = jobs.map(job => {
      const jobId = job._id.toString();
      
      return {
        id: jobId,
        recruiterId: job.recruiterId.toString(),
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        workplaceType: job.workplaceType || '',
        employmentType: job.employmentType || '',
        status: job.status || '',
        salary: {
          min: job.salary?.min || '',
          max: job.salary?.max || ''
        },
        experience: job.experience || '',
        description: job.description || '',
        requirements: Array.isArray(job.requirements) ? job.requirements : [],
        benefits: Array.isArray(job.benefits) ? job.benefits : [],
        skills: Array.isArray(job.skills) ? job.skills : [],
        postedDate: job.postedDate ? new Date(job.postedDate).toISOString() : null,
        createdAt: job.createdAt ? new Date(job.createdAt).toISOString() : null,
        updatedAt: job.updatedAt ? new Date(job.updatedAt).toISOString() : null,
        applicantStats: applicantStatsMap[jobId] || { total: 0, qualified: 0 }
      }
    })

    return serializedJobs
  } catch (error) {
    console.error("Error fetching jobs:", error)
    throw new Error("Failed to load jobs")
  }
}