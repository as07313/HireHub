"use server"

import { auth } from "@/app/middleware/auth"
import { Job } from "@/models/Job"
import { Candidate } from "@/models/User"
import { revalidatePath } from "next/cache"
import { BaseJob } from '@/app/types/job'

export async function findJobs() {

    try{ 

    const session = await auth()
    if (!session) {
        throw new Error("Unauthorized")
    }

    const jobs = await Job.find({
        status: 'active'
    })
    .select('-applicants')
    .sort({postedDate: -1 })
    .lean()

    return jobs 
} catch(error) {
    console.error('Error fetching jobs:', error)
    throw new Error('Failed to fetch jobs')
}
}
