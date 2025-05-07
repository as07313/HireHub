import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { Recruiter } from '@/models/User'; // Import Recruiter model

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
    const { fullName, email, password } = req.body;

    // Check if a recruiter with this email already exists
    const existingRecruiter = await Recruiter.findOne({ email });
    if (existingRecruiter) {
      return res.status(409).json({ error: 'Email already registered. Please login.' });
    }
    
    // Hash the password
    //const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a 6-digit verification code and set a 1-hour expiry
    const verificationCode = generateVerificationCode();
    const verificationExpires = Date.now() + 3600000;

    // Create a token payload with recruiter data including a type flag
    const payload = {
      fullName,
      email,
      password,
      verificationCode,
      verificationExpires,
      type: 'recruiter'
    };

    // Sign the token (expires in 1 hour)
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    
    // Setup Nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your HireHub Recruiter Verification Code",
      html: `<p>Hello ${fullName},</p>
             <p>Please use the following 6-digit code to verify your recruiter email:</p>
             <h2>${verificationCode}</h2>
             <p>This code will expire in one hour.</p>`
    };

    await transporter.sendMail(mailOptions);
    
    // Respond with token and email so the client can store them and redirect to the verification page
    res.status(201).json({ message: 'Verification code sent to email', token, email });
  } catch (error) {
    console.error('Recruiter registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}