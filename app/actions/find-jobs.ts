// app/actions/find-jobs.ts
"use server"

import { auth } from "@/app/middleware/auth"
import { Job } from "@/models/Job"
import { IJob } from "@/models/Job"
import { BaseJob } from "@/app/types/job"
import connectToDatabase from "@/lib/mongodb"

export async function findJobs(): Promise<IJob[]> {
  try {
    await connectToDatabase()

    const session = await auth()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Add type assertion for the MongoDB document
    const jobs = await Job.find({ 
      status: 'active' 
    })
    .select('-applicants')
    .sort({ postedDate: -1 })
    .lean()
    .exec() // Add exec() to ensure proper typing

    // Transform and validate the job data
    const typedJobs = jobs.map(job => ({
      _id: job._id,
      recruiterId: job.recruiterId,
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
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      skills: job.skills || [],
      applicants: job.applicants || [],
      postedDate: job.postedDate
    })) as IJob[]

    return typedJobs

  } catch (error) {
    console.error('Error fetching jobs:', error)
    throw new Error('Failed to fetch jobs')
  }
}

export async function findJobById(jobId: string): Promise<BaseJob | null> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      throw new Error("Unauthorized")
    }

    const job = await Job.findOne({ 
      _id: jobId,
      status: 'active' 
    })
    .select('-applicants')
    .lean() as IJob
    
    console.log(job)

    if (!job) return null

    // Transform IJob to BaseJob
    return {
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
    }

  } catch (error) {
    console.error('Error fetching job:', error)
    throw new Error('Failed to fetch job')
  }
}