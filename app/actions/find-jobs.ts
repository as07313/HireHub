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
      status: 'active' 
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
