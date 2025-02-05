// pages/api/applications/candidate/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import { Applicant } from '@/models/Applicant'
import { Job } from '@/models/Job'
import { Apiauth } from '@/app/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()

    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Add auth check and get user
    const user = await Apiauth(req, res)
    console.log("user-app", user)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const applications = await Applicant.find({
      candidateId: user.userId
    })
    .populate({
      path: 'jobId',
      model: Job,
      select: '-applicants'
    })
    .sort({ appliedDate: -1 })

    return res.status(200).json(applications)

  } catch (error) {
    console.error('Error fetching applied jobs:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}