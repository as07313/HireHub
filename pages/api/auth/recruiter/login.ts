import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Recruiter } from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await connectToDatabase();
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email });
    if (!recruiter) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isValid = await recruiter.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: recruiter._id, type: 'recruiter' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Add this cookie-setting code
    res.setHeader(
      'Set-Cookie', [
        `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
        `userType=recruiter; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
      ]
    );
    
    res.status(200).json({
      token,
      user: {
        id: recruiter._id,
        fullName: recruiter.fullName,
        email: recruiter.email,
        type: 'recruiter'
      }
    });
  } catch (error) {
    console.error('Recruiter Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}