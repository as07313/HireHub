import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import jwt from 'jsonwebtoken'
import { Candidate } from '@/models/User';
import { Job } from '@/models/Job';
import { Apiauth } from '@/app/middleware/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToDatabase()
        if (req.method !== 'GET') {
            return res.status(200).json({error: "method not allowed"})
        }
        const user = await Apiauth(req, res);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const candidate = await Candidate.findById(user.userId)
        .populate({
            path: 'savedJobs',
            model: 'Job',
            select: '-applicants' // Exclude applicants field
        });

        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        return res.status(200).json({ 
            savedJobs: candidate.savedJobs || [] 
        }); 

    }
    catch(error) {
        return res.status(500).json({
            error: "Message internal server error"
        })
    }

}