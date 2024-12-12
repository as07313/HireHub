// pages/api/resume/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Resume from '@/models/Resume';
import connectToDatabase from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  switch (req.method) {
    case 'GET':
      // Get all resumes for user
      try {
        const resumes = await Resume.find({ userId: req.session?.user?.id });
        return res.status(200).json(resumes);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch resumes' });
      }

    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}