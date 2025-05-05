"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/app/middleware/auth"
import { Applicant } from "@/models/Applicant"
import connectToDatabase from "@/lib/mongodb"
import { logError } from "@/lib/logger" // Assuming you have a logger utility

export async function updateApplicantStage(applicantId: string, jobId: string, newStage: string): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()
    console.log("Updating applicant stage:", { applicantId, jobId, newStage })

    const session = await auth()
    if (!session || session.type !== 'recruiter') {
      return { success: false, error: "Unauthorized" }
    }

    // Validate stage (optional but recommended)
    const validStages = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected'];
    if (!validStages.includes(newStage)) {
        return { success: false, error: "Invalid stage provided" };
    }

    const updatedApplicant = await Applicant.findByIdAndUpdate(
      applicantId,
      { status: newStage },
      { new: true } // Return the updated document
    );

    console.log("Updated applicant:", updatedApplicant)

    if (!updatedApplicant) {
      return { success: false, error: "Applicant not found" }
    }

    // Revalidate paths to reflect the change
    revalidatePath(`/recruiter/jobs/${jobId}/applicants`)
    revalidatePath(`/recruiter/jobs/${jobId}/applicants/${applicantId}`)

    return { success: true }

  } catch (error) {
    logError("Failed to update applicant stage", error)
    return { success: false, error: "Failed to update applicant stage. Please try again." }
  }
}