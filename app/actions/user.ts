// app/actions/user.ts
"use server"

import { Candidate } from "@/models/User"
import connectToDatabase from "@/lib/mongodb"
import { Applicant } from "@/models/Applicant"

export interface UserProfile {
  fullName: string
  email: string
  phone?: string
  skills?: string[]
  experience?: string
  location?: string
  bio?: string
  website?: string
  profileComplete: boolean
  stats: {
    appliedJobs: number
    savedJobs: number
    jobAlerts: number
  }
}

function isProfileComplete(user: any): boolean {
  const requiredFields = [
    'fullName',
    'email',
    'phone',
    'skills',
    'experience',
    'location',
    'bio'
  ]
  return requiredFields.every(field => Boolean(user[field]))
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    await connectToDatabase()

    const user = await Candidate.findById(userId)
    if (!user) {
      return null
    }

    const stats = await Promise.all([
      // Count applied jobs
      Applicant.countDocuments({ 
        candidateId: userId,
        status: { 
          $in: ['new', 'screening', 'shortlist', 'interview', 'offer', 'hired']
        } 
      }),
      
      // Count saved jobs using savedJobs array length
      Candidate.findById(userId)
        .select('savedJobs')
        .then(user => user?.savedJobs?.length || 0),
        
      // Job alerts count (for future implementation)
      Promise.resolve(0)
    ])

    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      skills: user.skills,
      experience: user.experience,
      location: user.location,
      bio: user.bio,
      website: user.website,
      profileComplete: isProfileComplete(user),
      stats: {
        appliedJobs: stats[0] ,
        savedJobs: stats[1] ,
        jobAlerts: stats[2] 
      }
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}