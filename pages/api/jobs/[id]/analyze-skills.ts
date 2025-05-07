import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import SkillAnalysis from '@/models/Analysis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const { id: jobId } = req.query;
    const { jobDescription, resumeFilePath } = req.body;

    if (!jobId || !jobDescription || !resumeFilePath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for existing analysis
    const existingAnalysis = await SkillAnalysis.findOne({ jobId });
    if (existingAnalysis) {
      return res.status(200).json(existingAnalysis.result);
    }

    // Call external API for skill analysis
    const response = await fetch('https://hirehub-api-795712866295.europe-west4.run.app/api/analyze-skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description: jobDescription, file_path: resumeFilePath }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`External API error: ${errorMessage}`);
    }

    const data = await response.json();

    // Save analysis result to the database
    const newAnalysis = new SkillAnalysis({
      jobId,
      filePath: resumeFilePath,
      result: {
        skill_gaps: data.skill_gaps,
        course_recommendations: data.course_recommendations,
      },
    });

    await newAnalysis.save();

    return res.status(200).json(newAnalysis.result);
  } catch (error: any) {
    console.error('Error in analyze-skills API:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}