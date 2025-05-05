// pages/api/resume/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Resume } from '@/models/Resume';
import jwt from 'jsonwebtoken';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2-client';
import { DeleteObjectCommand } from '@aws-sdk/client-s3'; // Import DeleteObjectCommand
import fs from 'fs'; // Keep fs for potential future use or local fallbacks if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    // Verify authentication
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as jwt.JwtPayload).userId;
    const { id } = req.query;
    console.log(id)

    switch (req.method) {
      // ... existing GET and PUT cases ...
      case 'GET':
        const resume = await Resume.findOne({
          _id: id,
          candidateId: userId
        });

        if (!resume) {
          return res.status(404).json({ error: 'Resume not found' });
        }

        // Note: We are NOT fetching the file content here, just the metadata.
        // If you need to provide a download link, you might need a separate endpoint
        // or generate a pre-signed URL for the R2 object.
        return res.status(200).json(resume);

      case 'PUT':
        // Ensure filePath is not accidentally overwritten if not provided in req.body
        const { filePath, ...updateData } = req.body;
        const updatedResume = await Resume.findOneAndUpdate(
          { _id: id, candidateId: userId },
          {
            ...updateData, // Apply other updates from request body
            lastModified: new Date()
          },
          { new: true }
        );

        if (!updatedResume) {
          return res.status(404).json({ error: 'Resume not found' });
        }

        return res.status(200).json(updatedResume);


      case 'DELETE':
        // Find the resume first to get the R2 key (filePath)
        const resumeToDelete = await Resume.findOne({
          _id: id,
          candidateId: userId // Ensure user owns the resume
        });
        console.log("Resume to delete:", resumeToDelete);

        if (!resumeToDelete) {
          return res.status(404).json({ error: 'Resume not found or not authorized to delete' });
        }

        // Delete from R2 if filePath exists
        if (resumeToDelete.filePath) {
          try {
            console.log(`Deleting object ${resumeToDelete.filePath} from R2 bucket ${R2_BUCKET_NAME}`);
            const deleteParams = {
              Bucket: R2_BUCKET_NAME,
              Key: resumeToDelete.filePath,
            };
            await r2Client.send(new DeleteObjectCommand(deleteParams));
            console.log(`Successfully deleted ${resumeToDelete.filePath} from R2.`);
          } catch (r2DeleteError) {
            console.error(`Failed to delete ${resumeToDelete.filePath} from R2:`, r2DeleteError);
            // Decide if you want to proceed with DB deletion or return an error
            // For now, log the error and continue with DB deletion
          }
        } else {
            console.warn(`Resume ${id} has no filePath, skipping R2 deletion.`);
        }

        // Delete the resume record from the database
        const dbDeleteResult = await Resume.deleteOne({ _id: id, candidateId: userId });

        if (dbDeleteResult.deletedCount === 0) {
           // This case should ideally not happen if findOne found it, but good practice
           console.error(`Failed to delete resume ${id} from database after R2 operation.`);
           return res.status(500).json({ error: 'Failed to delete resume record from database' });
        }

        console.log(`Successfully deleted resume ${id} from database.`);
        return res.status(200).json({ message: 'Resume deleted successfully' });

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