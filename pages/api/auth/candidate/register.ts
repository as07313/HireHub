// pages/api/auth/candidate/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { Candidate } from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const { fullName, email, phone, skills, experience, password } = req.body;

    // Check if user exists
    const existingUser = await Candidate.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new candidate
    const candidate = await Candidate.create({
      fullName,
      email,
      phone,
      skills: skills?.split(',').map((s: string) => s.trim()),
      experience,
      password
    });

    // Generate token
    const token = jwt.sign(
      { userId: candidate._id, type: 'candidate' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: candidate._id,
        fullName: candidate.fullName,
        email: candidate.email,
        type: 'candidate'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}