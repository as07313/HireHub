// pages/api/resume/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import  connectToDatabase  from '@/lib/mongodb';
import  Resume  from '@/models/Resume';
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const resumes = await Resume.find({ userId })
      .select('fileName fileSize lastModified status parsedData')
      .sort({ lastModified: -1 });

    return res.status(200).json(resumes);

  } catch (error) {
    console.error('Error fetching resumes:', error);
    return res.status(500).json({ error: 'Failed to fetch resumes' });
  }
}