// Example: Updated verify.ts for both account types
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Candidate, Recruiter } from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { token, code } = req.body;
  if (!token || !code) {
    return res.status(400).json({ error: 'Token and code are required' });
  }
  try {
    await connectToDatabase();
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (payload.verificationCode !== code || Date.now() > payload.verificationExpires) {
      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }
    // Create document based on account type
    if (payload.type === 'recruiter') {
      const recruiter = await Recruiter.create({
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password,
        emailVerified: true,
        // add recruiter-specific fields if needed
      });
      return res.status(200).json({ message: 'Email verified and recruiter account created successfully' });
    } else {
      const candidate = await Candidate.create({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        skills: payload.skills,
        experience: payload.experience,
        password: payload.password,
        emailVerified: true,
      });
      return res.status(200).json({ message: 'Email verified and candidate account created successfully' });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}