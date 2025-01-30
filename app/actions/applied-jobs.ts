// app/actions/jobs.ts
"use server"

import { auth } from "@/app/middleware/auth"
import { Job } from "@/models/Job"
import { Applicant } from "@/models/Applicant"
import connectToDatabase from "@/lib/mongodb"
import { BaseJob } from "@/app/types/job"

export async function getAppliedJobs(): Promise<BaseJob[]> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Find all applications for the candidate
    const applications = await Applicant.find({ 
      candidateId: session.userId 
    })
    .populate({
      path: 'jobId',
      model: Job,
      select: '-applicants'
    })
    .sort({ appliedDate: -1 })
    .lean()

    // Extract and return the job data
    return applications.map(app => ({
      ...app.jobId,
      _id: app.jobId._id.toString(),
      status: app.status,
      appliedDate: app.appliedDate
    })) as BaseJob[]

  } catch (error) {
    console.error('Error fetching applied jobs:', error)
    throw new Error('Failed to fetch applied jobs')
  }
}