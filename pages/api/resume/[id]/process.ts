import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Resume } from '@/models/Resume';
import { Apiauth } from '@/app/middleware/auth';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const user = await Apiauth(req, res);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query;
    
    // Find the resume with all fields including filePath
    const resume = await Resume.findOne({
      _id: id,
      candidateId: user.userId
    }).select('+filePath');

    console.log("Resume found:", resume);
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    if (!resume.filePath) {
      return res.status(400).json({ error: 'Resume file path not found' });
    }

    //Verify file exists
    if (!fs.existsSync(resume.filePath)) {
      return res.status(404).json({ error: 'Resume file does not exist' });
    }

    //Create form data and send to LlamaCloud
    const formData = new FormData();
    const fileStream = fs.createReadStream(resume.filePath);
    formData.append('files', fileStream, { filename: resume.fileName });

    console.log('Sending file to FastAPI backend...');

    const llamaResponse = await fetch('https://hirehub-api-795712866295.europe-west4.run.app/api/upload', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    console.log('LlamaCloud response status:', llamaResponse.status);


    if (!llamaResponse.ok) {
      const error = await llamaResponse.json();
      const errorMessage = (error as { message?: string }).message || 'Failed to process resume';
      throw new Error(errorMessage);
    }

    //Update resume status after successful processing
    await Resume.findByIdAndUpdate(id, { 
      status: 'completed',
      lastModified: new Date()
    });

    return res.status(200).json({ message: 'Resume processed successfully' });

  } catch (error) {
    console.error('Error processing resume:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}