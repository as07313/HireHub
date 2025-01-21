// pages/api/user/profile.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import  connectToDatabase  from '@/lib/mongodb';
import { Candidate } from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

    // Fetch user data
    const user = await Candidate.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch user statistics
    const stats = await Promise.all([
      // Add your database queries for stats here
      // Example:
      // Application.countDocuments({ userId: user._id }),
      // SavedJob.countDocuments({ userId: user._id }),
      // JobAlert.countDocuments({ userId: user._id })
    ]);

    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      profileComplete: isProfileComplete(user)
      // stats: {
      //   appliedJobs: stats[0] || 0,
      //   favoriteJobs: stats[1] || 0,
      //   jobAlerts: stats[2] || 0
      // }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}

function isProfileComplete(user: any): boolean {
  const requiredFields = [
    'fullName',
    'email',
    'phone',
    'skills',
    'experience'
  ];
  
  return requiredFields.every(field => Boolean(user[field]));
}