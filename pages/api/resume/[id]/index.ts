// pages/api/resume/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Resume from '@/models/Resume';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as jwt.JwtPayload).userId;
    const { id } = req.query;
    console.log(id)

    switch (req.method) {
      case 'GET':
        const resume = await Resume.findOne({ 
          _id: id, 
          candidateId: userId 
        });

        if (!resume) {
          return res.status(404).json({ error: 'Resume not found' });
        }

        return res.status(200).json(resume);

      case 'PUT':
        const updatedResume = await Resume.findOneAndUpdate(
          { _id: id, candidateId: userId },
          { 
            ...req.body,
            lastModified: new Date() 
          },
          { new: true }
        );

        if (!updatedResume) {
          return res.status(404).json({ error: 'Resume not found' });
        }

        return res.status(200).json(updatedResume);

      case 'DELETE':
        const deletedResume = await Resume.findOneAndDelete({
          _id: id,
        });
        console.log(deletedResume)

        if (!deletedResume) {
          return res.status(404).json({ error: 'Resume not found' });
        }

        return res.status(200).json({ message: 'Resume deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling resume:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}