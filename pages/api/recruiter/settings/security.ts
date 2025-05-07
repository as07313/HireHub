
import { NextApiRequest, NextApiResponse } from 'next';
import connectToDatabase from '@/lib/mongodb';
import { Recruiter, IRecruiter } from '@/models/User';
import { Apiauth } from '@/app/middleware/auth'; // Assuming Apiauth returns { userId: string, type: string } or handles errors

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    await connectToDatabase();
    const userSession = await Apiauth(req, res);

    // If Apiauth has already sent a response (e.g., for an auth error), do nothing further.
    if (res.headersSent) {
      return;
    }

    if (!userSession || userSession.type !== 'recruiter') {
      // This case handles scenarios where Apiauth might return null/undefined
      // without sending a response, or if the type is incorrect.
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
        return res.status(400).json({ message: 'New password must be a string of at least 6 characters' });
    }

    const recruiter = await Recruiter.findById(userSession.userId) as IRecruiter | null;

    if (!recruiter) {
      return res.status(404).json({ message: 'Recruiter not found' });
    }

    const isMatch = await recruiter.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Set the new password. The pre-save hook in the User model will handle hashing.
    recruiter.password = newPassword;
    await recruiter.save();

    return res.status(200).json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Error changing recruiter password:', error);
    if (res.headersSent) {
      return;
    }
    // Handle specific JWT errors if Apiauth throws them instead of sending a response
    // or if an error occurs during token processing within Apiauth that isn't handled by sending a response.
    if (
      error instanceof Error &&
      (error.name === 'JsonWebTokenError' || 
       error.name === 'TokenExpiredError' || 
       (error.message && (error.message.toLowerCase().includes('jwt') || error.message.toLowerCase().includes('token'))))
    ) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
    
    return res.status(500).json({ message: 'Internal server error' });
  }
}
