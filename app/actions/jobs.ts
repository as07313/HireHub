// app/actions/jobs.ts
"use server"

import { auth } from "@/app/middleware/auth"
import { Job } from "@/models/Job"
import { Candidate } from "@/models/User"
import { revalidatePath } from "next/cache"

export async function getSavedJobs() {
  const session = await auth()
  console.log("session", session)
  if (!session) throw new Error("Unauthorized")

  const user = await Candidate.findById(session.userId)
    .populate({
      path: 'savedJobs',
      model: Job
    })
    .select('savedJobs')

  return user?.savedJobs || []
}

export async function saveJob(jobId: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  await Candidate.findByIdAndUpdate(session.userId, {
    $addToSet: { savedJobs: jobId }
  })

  revalidatePath('/candidate/dashboard/saved')
}

export async function removeSavedJob(jobId: string) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  await Candidate.findByIdAndUpdate(session.userId, {
    $pull: { savedJobs: jobId }
  })

  revalidatePath('/candidate/dashboard/saved')
}