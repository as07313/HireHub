import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import Resume from '@/models/Resume';
import { Apiauth } from '@/app/middleware/auth';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data'; // Correct FormData import
import fetch from 'node-fetch'; // Ensure you're using node-fetch for backend API calls

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Incoming request: ${req.method}`);

  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connection established.');

    // Use Apiauth middleware
    console.log('Authenticating user...');
    const user = await Apiauth(req, res);
    if (!user) {
      console.log('User authentication failed.');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    console.log(`User authenticated: ${user.userId}`);

    switch (req.method) {

      case 'GET':
        const resumes = await Resume.find({ candidateId: user.userId })
          .select('fileName fileSize uploadDate lastModified status parsedData')
          .sort({ lastModified: -1 });

        return res.status(200).json(resumes);

      case 'POST': {
        console.log('Processing file upload...');

        const form = formidable({
          uploadDir: './uploads',
          keepExtensions: true,
          maxFileSize: 5 * 1024 * 1024, // 5MB
          filter: (part) => {
            const isValid =
              part.mimetype === 'application/pdf' ||
              part.mimetype === 'application/msword' ||
              part.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            console.log(`File type check: ${part.mimetype} - ${isValid ? 'Valid' : 'Invalid'}`);
            return isValid;
          },
        });

        console.log('Parsing form data...');
        const [fields, files] = await form.parse(req);
        console.log('Form data parsed successfully.');

        const file = files.file?.[0];
        if (!file) {
          console.log('No file uploaded.');
          return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`Received file: ${file.originalFilename} (${file.size} bytes)`);

        // ✅ Use FormData and append a stream instead of converting to Buffer
        if (fields.isForApplication && fields.isForApplication[0] === 'true') {
        const formData = new FormData();
        const fileStream = fs.createReadStream(file.filepath);

        formData.append('files', fileStream, { filename: file.originalFilename || 'resume.pdf' });

        console.log('Sending file to FastAPI backend...');

        const llamaResponse = await fetch('https://hirehub-api-795712866295.europe-west4.run.app/api/upload', {
          method: 'POST',
          body: formData,
          headers: formData.getHeaders(), // Important for multipart/form-data requests
        });

        console.log(llamaResponse)

        if (!llamaResponse.ok) {
          console.error('Error response from LlamaCloud API');
          const error = await llamaResponse.json();
          console.error('LlamaCloud API Error:', error);
          if (error instanceof Error) {
            throw new Error(error.message || 'Failed to process resume');
          } else {
            throw new Error('Failed to process resume');
          }
        }
      }

        // console.log('File successfully processed by LlamaCloud API.');
        return res.status(201).json({ message: 'Successful' });
      }

      default:
        console.log(`Method not allowed: ${req.method}`);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling resume:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
