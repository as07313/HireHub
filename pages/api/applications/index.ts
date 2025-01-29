import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Applicant } from '@/models/Applicant';
import { Job } from '@/models/Job';
import { Apiauth }  from '@/app/middleware/auth'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectToDatabase();

        switch (req.method) {
            case 'POST':
                const user = await Apiauth(req, res);
                if (!user) {
                    return res.status(401).json({error: 'User not found'});
                }

                const { jobId, resumeId, coverLetter } = req.body;

                if (!jobId || !resumeId) {
                    return res.status(400).json({error: 'Missing required fields'})
                }

                const existing = await Applicant.findOne({
                    candidateId: user.userId, // Use userId instead of _id
                    jobId
                });

                if (existing) {
                    return res.status(400).json({error: 'Already applied'})
                }

                const application = await Applicant.create({
                    candidateId: user.userId,
                    jobId,
                    resumeId,
                    coverLetter,
                    status: 'new',
                    appliedDate: new Date(),
                    jobFitScore: 0
                });

                await Job.findByIdAndUpdate(jobId, {
                    $addToSet: { applicants: user.userId }
                });

                return res.status(201).json(application);

            default:
                return res.status(405).json({error: 'Method not allowed'});    
        }
    } catch(error) {
        console.error('Application error', error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}