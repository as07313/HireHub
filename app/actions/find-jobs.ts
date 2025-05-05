// app/actions/find-jobs.ts
"use server"

import { auth } from "@/app/middleware/auth"
import { Job, IJob } from "@/models/Job"
import { BaseJob } from "@/app/types/job"
import connectToDatabase from "@/lib/mongodb"
import { Document, Types } from "mongoose"

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

export async function findJobById(jobId: string): Promise<BaseJob | null> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      throw new Error("Unauthorized")
    }

    const jobDoc = await Job.findOne({ 
      _id: jobId,
    })
    .select('-applicants')
    .lean<PopulatedJob>(); // ✅ Correctly types lean() output

    if (!jobDoc) return null

    return {
      _id: jobDoc._id.toString(),
      title: jobDoc.title,
      department: jobDoc.department,
      location: jobDoc.location,
      workplaceType: jobDoc.workplaceType,
      employmentType: jobDoc.employmentType,
      status: jobDoc.status === 'open' ? 'active' : 'closed',
      salary: {
        min: jobDoc.salary.min,
        max: jobDoc.salary.max
      },
      experience: jobDoc.experience,
      description: jobDoc.description,
      requirements: jobDoc.requirements || [],
      benefits: jobDoc.benefits || [],
      skills: jobDoc.skills || [],
      postedDate: jobDoc.postedDate
    };
  } catch (error) {
    console.error('Error fetching job:', error)
    throw new Error('Failed to fetch job')
  }
}

export async function findJobs(): Promise<BaseJob[]> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Find all active jobs
    const jobDocs = await Job.find({ 
      status: 'active' 
    })
    .select('-applicants')
    .sort({ postedDate: -1 })
    .lean<PopulatedJob[]>()

    // Transform to BaseJob format
    return jobDocs.map(job => ({
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

  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw new Error('Failed to fetch jobs')
  }
}
