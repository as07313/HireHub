"use server"

import { auth } from "@/app/middleware/auth"
import { Job, IJob } from "@/models/Job"
import { Applicant, IApplicant } from "@/models/Applicant"
import { BaseJob } from "@/app/types/job"
import connectToDatabase from "@/lib/mongodb"
import { Resume, IResume } from '@/models/Resume'
import { Types } from 'mongoose'

import "@/models/Job"
import "@/models/User"
import "@/models/Applicant"

// Type for populated application data from database
interface PopulatedApplicationData {
  _id: Types.ObjectId;
  candidateId: Types.ObjectId; 
  jobId: BaseJob;
  status: string;
  appliedDate: Date;
  resumeId?: {
    _id: Types.ObjectId;
    fileName: string;
  };
}

// Interface for return type of getAppliedJob
export interface AppliedJob extends BaseJob {
  resumeFilename?: string | null;
}

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
    })
    .populate({
      path: 'resumeId',
      model: Resume,
      select: 'fileName'
    })
    .sort({ appliedDate: -1 })
    .lean<PopulatedApplicationData[]>()

    // Transform to BaseJob format
    const jobs = applications.map(app => ({
      _id: app.jobId._id.toString(),
      title: app.jobId.title, 
      department: app.jobId.department,
      location: app.jobId.location,
      workplaceType: app.jobId.workplaceType,
      employmentType: app.jobId.employmentType,
      status: app.jobId.status,
      salary: app.jobId.salary,
      experience: app.jobId.experience,
      description: app.jobId.description,
      requirements: Array.isArray(app.jobId.requirements) ? app.jobId.requirements : [],
      benefits: Array.isArray(app.jobId.benefits) ? app.jobId.benefits : [],
      skills: Array.isArray(app.jobId.skills) ? app.jobId.skills : [],
      postedDate: app.jobId.postedDate,
      appliedDate: app.appliedDate
    }))

    return jobs
  } catch (error) {
    console.error('Error fetching applied jobs:', error)
    throw new Error('Failed to fetch applied jobs')
  }
}

export async function getAppliedJob(jobId: string): Promise<AppliedJob | null> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const application = await Applicant.findOne({ 
      jobId,
      candidateId: session.userId 
    })
    .populate('jobId')
    .populate('resumeId', 'fileName')
    .lean<PopulatedApplicationData>()

    if (!application || !application.jobId) return null

    return {
      _id: application.jobId._id.toString(),
      title: application.jobId.title,
      department: application.jobId.department,
      location: application.jobId.location,
      workplaceType: application.jobId.workplaceType,
      employmentType: application.jobId.employmentType,
      status: application.jobId.status as 'active' | 'inactive' | 'closed',
      salary: application.jobId.salary,
      experience: application.jobId.experience,
      description: application.jobId.description,
      requirements: Array.isArray(application.jobId.requirements) 
        ? application.jobId.requirements 
        : [],
      benefits: Array.isArray(application.jobId.benefits)
        ? application.jobId.benefits
        : [],
      skills: Array.isArray(application.jobId.skills)
        ? application.jobId.skills
        : [],
      postedDate: application.jobId.postedDate,
      appliedDate: application.appliedDate,
      resumeFilename: application.resumeId?.fileName || null
    }
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch applied job')
  }
}