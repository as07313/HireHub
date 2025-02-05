// pages/api/auth/recruiter/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import  connectToDatabase  from '@/lib/mongodb';
import  { Recruiter }  from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const { email, password } = req.body;

    // Find recruiter
    const recruiter = await Recruiter.findOne({ 
      email
    });
    
    if (!recruiter) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await recruiter.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: recruiter._id, type: 'recruiter' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: recruiter._id,
        fullName: recruiter.fullName,
        type: 'recruiter'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}