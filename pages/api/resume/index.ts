import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Resume } from '@/models/Resume';
import { Apiauth } from '@/app/middleware/auth';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch'; 
import os from 'os'; 
import { PutObjectCommand } from '@aws-sdk/client-s3'; 
import { r2Client, R2_BUCKET_NAME } from '../../../lib/r2-client';
import { v4 as uuidv4 } from 'uuid'; 


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

        // Initialize formidable first
        const form = formidable({
          uploadDir: os.tmpdir(), // Use the system's temporary directory
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
      
        // Now parse the form after initialization
        console.log('Parsing form data...');
        const [fields, files] = await form.parse(req);
        console.log('Form data parsed successfully.');
      
        const file = files.file?.[0];
        if (!file) {
          console.log('No file uploaded.');
          return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create resume record *before* upload to get the ID
        // Let Mongoose generate the _id
        const resume = await Resume.create({
          candidateId: user.userId,
          fileName: file.originalFilename,
          fileSize: `${Math.round(file.size / 1024)} KB`,
          // Store the R2 key instead of the local temporary path
          // We will update filePath after creating the record and getting the ID
          filePath: '', // Set temporary empty path
          uploadDate: new Date(),
          lastModified: new Date(),
          status: 'uploading', // Set initial status to uploading
          processingStatus: 'queued',
          parsedData: null, 
          processingError: null, 
        });
        
        // Construct the R2 key using the generated resume._id
        const r2Key = `resumes/${user.userId}/${resume._id}/${file.originalFilename}`; 

        // Update the resume record with the correct filePath
        resume.filePath = r2Key;
        await resume.save();

        console.log('Resume record created:', resume);
        console.log(`Received file: ${file.originalFilename} (${file.size} bytes)`);
        console.log(`Uploading to R2 with key: ${r2Key}`);

        try {
          // Upload to R2
          const fileStream = fs.createReadStream(file.filepath);
          const uploadParams = {
            Bucket: R2_BUCKET_NAME,
            Key: r2Key,
            Body: fileStream,
            ContentType: file.mimetype || 'application/octet-stream',
          };
          await r2Client.send(new PutObjectCommand(uploadParams));
          console.log(`Successfully uploaded ${r2Key} to R2 bucket ${R2_BUCKET_NAME}.`);

          // Update resume status to pending (ready for processing) after successful upload
          await Resume.findByIdAndUpdate(resume._id, { status: 'pending' });

          // Clean up the temporary file
          fs.unlink(file.filepath, (err) => {
            if (err) {
              console.error(`Error deleting temporary file ${file.filepath}:`, err);
            } else {
              console.log(`Temporary file ${file.filepath} deleted.`);
            }
          });

          // Respond to client
          return res.status(201).json({ message: 'Resume uploaded successfully', resumeId: resume._id });

        } catch (uploadError) {
            console.error(`Failed to upload ${r2Key} to R2:`, uploadError);
            // Optionally: Update resume status to 'error' in the database
            await Resume.findByIdAndUpdate(resume._id, { status: 'error', processingError: 'R2 upload failed' });
            // Clean up the temporary file even if upload fails
            fs.unlink(file.filepath, (err) => {
              if (err) console.error(`Error deleting temporary file ${file.filepath} after failed upload:`, err);
            });
            return res.status(500).json({ error: 'Failed to upload file to storage' });
        }
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
