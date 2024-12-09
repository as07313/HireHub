import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import Job from '@/models/Job'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase()

  if (req.method === 'GET') {
    try {
      const jobs = await Job.find({})
      res.status(200).json(jobs)
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch jobs' })
    }
  } else {
    res.status(405).end() // Method Not Allowed
  }
}