// filepath: pages/api/resumes/download/[...key].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2-client';
import { Apiauth } from '@/app/middleware/auth'; // Using existing auth middleware
import { Readable } from 'stream';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {

    const { key: keySegments } = req.query;

    if (!keySegments || !Array.isArray(keySegments) || keySegments.length === 0) {
      return res.status(400).json({ error: 'File key not provided' });
    }

    const r2Key = keySegments.join('/');
    console.log('R2 Key:', r2Key); // Log the R2 key for debugging
    // Extract filename from the R2 key (e.g., last part of "resumes/userId/resumeId/filename.pdf")
    const fileName = r2Key.substring(r2Key.lastIndexOf('/') + 1);

    const getObjectParams = {
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
    };

    const command = new GetObjectCommand(getObjectParams);
    const r2Object = await r2Client.send(command);

    if (!r2Object.Body) {
      return res.status(406).json({ error: 'File not found in R2' });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    if (r2Object.ContentType) {
      res.setHeader('Content-Type', r2Object.ContentType);
    } else {
      res.setHeader('Content-Type', 'application/octet-stream'); // Default fallback
    }
    if (r2Object.ContentLength) {
        res.setHeader('Content-Length', r2Object.ContentLength.toString());
    }

    // Stream the file
    if (r2Object.Body instanceof Readable) {
      r2Object.Body.pipe(res);
      r2Object.Body.on('error', (err) => {
        console.error('Error streaming file from R2:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error streaming file' });
        } else {
          res.end();
        }
      });
    } else {
      // Fallback for non-streamable body types (e.g., Uint8Array)
      const bodyBytes = await r2Object.Body.transformToByteArray();
      res.send(Buffer.from(bodyBytes));
    }

  } catch (error: any) {
    console.error('Error downloading file from R2:', error);
    if (error.name === 'NoSuchKey') {
      return res.status(404).json({ error: 'File not found' });
    }
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}