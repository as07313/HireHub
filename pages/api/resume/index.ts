// pages/api/resume/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { Apiauth } from '@/app/middleware/auth';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    // Use Apiauth middleware
    const user = await Apiauth(req, res);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const resumes = await Resume.find({ candidateId: user.userId })
          .select('fileName fileSize uploadDate lastModified status parsedData')
          .sort({ lastModified: -1 });

        return res.status(200).json(resumes);

      case 'POST':
        const form = formidable({
          uploadDir: './uploads',
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
          return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create resume record
        const resume = await Resume.create({
          candidateId: user.userId,
          fileName: file.originalFilename,
          fileSize: `${Math.round(file.size / 1024)} KB`,
          uploadDate: new Date(),
          lastModified: new Date(),
          status: 'completed',
          parsedData: {
            Name: 'Pending Parse',
            'Contact Information': 'Pending Parse',
            Education: [{
              Degree: 'Pending Parse',
              Institution: 'Pending Parse',
              Year: 'Pending Parse'
            }],
            'Work Experience': [{
              'Job Title': 'Pending Parse',
              Company: 'Pending Parse',
              Duration: 'Pending Parse',
              Description: 'Pending Parse'
            }],
            Skills: ['Pending Parse']
          }
        });

        return res.status(201).json(resume);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling resume:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}