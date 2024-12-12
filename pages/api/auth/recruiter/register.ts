// pages/api/auth/recruiter/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { Recruiter } from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const { 
      fullName,
      companyName,
      companyEmail,
      personalEmail,
      companyWebsite,
      employeeCount,
      password 
    } = req.body;

    // Check if company email exists
    const existingCompany = await Recruiter.findOne({ companyEmail });
    if (existingCompany) {
      return res.status(400).json({ error: 'Company already registered' });
    }

    // Create new recruiter
    const recruiter = await Recruiter.create({
      fullName,
      companyName,
      companyEmail,
      personalEmail,
      companyWebsite,
      employeeCount,
      password
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
        companyName: recruiter.companyName,
        type: 'recruiter'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}