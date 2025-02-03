// pages/api/jobs/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import { Job } from '@/models/Job'
import { Apiauth }  from '@/app/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()
    const { id } = req.query

    switch (req.method) {
      case 'GET':
        const job = await Job.findById(id)
          .select('-applicants')

        if (!job) {
          return res.status(404).json({ error: 'Job not found' })
        }

        return res.status(200).json(job)

      case 'PUT':
        //const  user  = await Apiauth(req, res)
        // if (user.role !== 'recruiter') {
        //   return res.status(403).json({ error: 'Not authorized' })
        // }

        const updatedJob = await Job.findByIdAndUpdate(
          id,
          { ...req.body },
          { new: true }
        )

        return res.status(200).json(updatedJob)

      case 'DELETE':
        //const authUser = await auth(req, res)
        await Job.findByIdAndUpdate(id, { status: 'closed' })
        return res.status(200).json({ message: 'Job closed successfully' })

      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error('Error handling job:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}