// app/actions/applied-jobs.ts
"use server"

import { auth } from "@/app/middleware/auth"
import { Job, IJob } from "@/models/Job"
import { Applicant, IApplicant } from "@/models/Applicant"
import { BaseJob } from "@/app/types/job"
import connectToDatabase from "@/lib/mongodb"
import { Document } from 'mongoose'

import "@/models/Job"
import "@/models/User"
import "@/models/Applicant"


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

interface PopulatedApplication extends Omit<IApplicant, 'jobId'> {
  _id: string;
  jobId: PopulatedJob;
  status: 'new' | 'screening' | 'shortlist' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: Date;
  jobFitScore: number;
}

export async function getAppliedJobs(): Promise<BaseJob[]> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) {
      throw new Error("Unauthorized")
    }

    // Find all applications for the candidate
    const rawApplications = await Applicant.find({ 
      candidateId: session.userId 
    })
    .populate({
      path: 'jobId',
      model: 'Job',  // Use string model name instead of model reference
      select: '-applicants'
    })
    .sort({ appliedDate: -1 })
    .lean()

    // Type assertion after validation
    const applications = rawApplications as unknown as PopulatedApplication[]

    // Transform to BaseJob format
    const jobs = applications.map(app => ({
      _id: app.jobId._id.toString(),
      title: app.jobId.title,
      department: app.jobId.department,
      location: app.jobId.location,
      workplaceType: app.jobId.workplaceType,
      employmentType: app.jobId.employmentType,
      status: app.status as 'active' | 'inactive' | 'closed',
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

export async function getAppliedJob(jobId: string): Promise<BaseJob | null> {
  try {
    await connectToDatabase()
    
    const session = await auth()
    if (!session) throw new Error("Unauthorized")

    const application = await Applicant.findOne({ 
      jobId,
      candidateId: session.userId 
    })
    .populate<{ jobId: PopulatedJob }>('jobId')
    .lean()

    if (!application) return null

    // Type assertion after validation
    const populatedApp = application as unknown as PopulatedApplication

    return {
      _id: populatedApp.jobId._id.toString(),
      title: populatedApp.jobId.title,
      department: populatedApp.jobId.department,
      location: populatedApp.jobId.location,
      workplaceType: populatedApp.jobId.workplaceType,
      employmentType: populatedApp.jobId.employmentType,
      status: populatedApp.status as 'active' | 'inactive' | 'closed',
      salary: populatedApp.jobId.salary,
      experience: populatedApp.jobId.experience,
      description: populatedApp.jobId.description,
      requirements: Array.isArray(populatedApp.jobId.requirements) 
        ? populatedApp.jobId.requirements 
        : [],
      benefits: Array.isArray(populatedApp.jobId.benefits)
        ? populatedApp.jobId.benefits
        : [],
      skills: Array.isArray(populatedApp.jobId.skills)
        ? populatedApp.jobId.skills
        : [],
      postedDate: populatedApp.jobId.postedDate
    }

  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch applied job')
  }
}