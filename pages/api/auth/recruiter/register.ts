// pages/api/auth/recruiter/register.ts 
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Recruiter } from '@/models/User';
import jwt from 'jsonwebtoken';

// pages/api/auth/recruiter/register.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const { 
      fullName,
      email,
      password
    } = req.body;

    // Check for existing recruiter with same email
    const existingRecruiter = await Recruiter.findOne({
      $or: [
        { email: email },
        { workEmail: email }  // Check workEmail field too
      ]
    });

    if (existingRecruiter) {
      return res.status(400).json({ 
        error: 'Email already registered' 
      });
    }

    // Create new recruiter following IRecruiter interface
    const recruiter = await Recruiter.create({
      fullName,
      email,               // Base email from IBaseUser
      workEmail: email,    // Company email (same as base email initially)
      password,            // From IBaseUser
      companyId: null,     // From IRecruiter
      jobPosts: [],        // From IRecruiter
      isActive: true,      // From IBaseUser
      profileComplete: false, // From IBaseUser
      createdAt: new Date() // From IBaseUser
    });

    // Generate token
    const token = jwt.sign(
      { userId: recruiter._id, type: 'recruiter' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: recruiter._id,
        fullName: recruiter.fullName,
        type: 'recruiter'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}