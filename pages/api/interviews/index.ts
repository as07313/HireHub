import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Applicant } from '@/models/Applicant';
import { Apiauth } from '@/app/middleware/auth';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const user = await Apiauth(req, res);

    if (!user || !user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { applicantId, interviewType, date, time, notes } = req.body;

    // Validate required fields
    if (!applicantId || !interviewType || !date || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Combine date and time into a single Date object
    const scheduledDate = new Date(`${date}T${time}`);

    // Update the applicant document with new interview
    const updatedApplicant = await Applicant.findByIdAndUpdate(
      applicantId,
      {
        $push: {
          interviews: {
            scheduledDate,
            type: interviewType,
            status: 'scheduled',
            feedback: notes,
            interviewer: user.userId
          }
        },
        status: 'interview' // Update applicant status to interview
      },
      { new: true }
    );

    if (!updatedApplicant) {
      return res.status(404).json({ error: 'Applicant not found' });
    }

    return res.status(200).json(updatedApplicant);

  } catch (error) {
    console.error('Error scheduling interview:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}