// pages/api/jobs/index.ts
import { NextApiRequest, NextApiResponse } from 'next'
import connectToDatabase from '@/lib/mongodb'
import { Job } from '@/models/Job'
import { Apiauth }  from '@/app/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    await connectToDatabase()

    switch (req.method) {
      case 'GET':
        const jobs = await Job.find({status: 'active'})
        .sort({postedDate: -1})
        .select('-applicants');

        return res.status(200).json(jobs);

      case 'POST':
        
        const { user } = await Apiauth(req, res);

        const job = await Job.create({
          ...req.body,
          recruiterId: user._id,
          companyId: user.companyId,
          status: 'active'
        })

        return res.status(201).json(job)

        default: 
          return res.status(405).json({error: 'Method not allowed'})

        }
      }
      catch (error) {
        return res.status(500).json({ error: error.message })

    }
}