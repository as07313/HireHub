// pages/api/resume/parse.tsx
import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import path from 'path';
import Resume from '@/models/Resume';
import connectToDatabase from '@/lib/mongodb';
//import { authMiddleware } from '@/middleware/auth.ts'
import jwt from 'jsonwebtoken';

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    await connectToDatabase();
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new Error('Not authenticated')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    const userId = (decoded as jwt.JwtPayload).userId

    const form = formidable({
      uploadDir: path.join(process.cwd(), 'uploads'),
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      filter: (part) => {
        return part.mimetype === 'application/pdf' || 
               part.mimetype === 'application/msword' ||
               part.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
    });

    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      throw new Error('No file uploaded');
    }

    // Read file content as Buffer
    const fileContent = readFileSync(file.filepath);
    
    // Create form data with Blob
    const formData = new FormData();
    const blob = new Blob([fileContent], { type: file.mimetype || undefined });
    formData.append('file', blob, file.originalFilename || 'file');

    // Call Python parser
    const pythonResponse = await fetch('http://localhost:8000/parse-resume', {
      method: 'POST',
      body: formData
    });

    if (!pythonResponse.ok) {
      const error = await pythonResponse.json();
      throw new Error(error.detail || 'Failed to parse resume');
    }

    console.log("python",pythonResponse)
    const parsedData = await pythonResponse.json();
    console.log("parseddata" ,parsedData)


    // Save to database
    const resume = await Resume.create({
        userId, // Use the decoded userId
        fileName: file.originalFilename,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        status: 'completed',
        parsedData
      })

    return res.status(200).json(resume);

  } catch (error) {
    console.error('Resume parsing error:', error);
    return res.status(500).json({ error: (error as Error).message });
  }
}