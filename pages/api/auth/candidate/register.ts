import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

// Helper: generate a 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await connectToDatabase();
    const { fullName, email, phone, skills, experience, password } = req.body;

    // Generate a 6-digit verification code and set expiry (1 hour)
    const verificationCode = generateVerificationCode();
    const verificationExpires = Date.now() + 3600000; // timestamp in ms

    // Create a token payload with candidate data and code info (candidate document is NOT created yet)
    const payload = {
      fullName,
      email,
      phone,
      skills: skills?.split(',').map((s: string) => s.trim()),
      experience,
      password,
      verificationCode,
      verificationExpires,
      type: 'candidate'
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Setup Nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use passkey if necessary
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your HireHub Verification Code",
      html: `<p>Hello ${fullName},</p>
             <p>Please use the following 6-digit code to verify your email:</p>
             <h2>${verificationCode}</h2>
             <p>This code will expire in one hour.</p>`
    };

    await transporter.sendMail(mailOptions);

    // Respond with token and email so the client can store them and redirect to verification page
    res.status(201).json({ message: 'Verification code sent to email', token, email });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}