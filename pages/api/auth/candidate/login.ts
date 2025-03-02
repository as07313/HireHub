import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Candidate } from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await connectToDatabase();
    const { email, password } = req.body;
    // Find candidate
    const candidate = await Candidate.findOne({ email });
    if (!candidate) {
      return res.status(401).json({ error: 'Invalid credentials or email not verified' });
    }
    // Verify password
    const isValid = await candidate.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Generate token for session (e.g., 7 days)
    const token = jwt.sign(
      { userId: candidate._id, type: 'candidate' },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    // Set HTTP-only cookies as needed
    res.setHeader(
      'Set-Cookie', [
        `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`,
        `userType=candidate; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`
      ]
    );
    res.status(200).json({
      token,
      user: {
        id: candidate._id,
        fullName: candidate.fullName,
        email: candidate.email,
        type: 'candidate'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}