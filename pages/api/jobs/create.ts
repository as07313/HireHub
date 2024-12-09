import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import Job from '@/models/Job'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase()
    console.log('Connected to MongoDB in create job API')

    if (req.method === 'POST') {
      const job = new Job(req.body)
      await job.save()
      res.status(201).json(job)
    } else {
      res.status(405).end() // Method Not Allowed
    }
  } catch (error) {
    console.error('Error in create job API:', error)
    res.status(500).json({ error: 'Failed to connect to database' })
  }
}