// app/middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

// For API Routes
export async function Apiauth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = verify(token, process.env.JWT_SECRET!)
    ;(req as any).user = decoded
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

interface AuthUser {
  userId: string;
  type: 'candidate' | 'recruiter';
}

export async function auth() {
  try {
    // Get cookie store
    const cookieStore = await cookies()
    const token = await cookieStore.get('token')

    if (!token || !token.value) {
      return null;
    }

    // Verify token
    const decoded = verify(token.value, process.env.JWT_SECRET!) as AuthUser;

    // Return user data
    return {
      userId: decoded.userId,
      type: decoded.type
    };

  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}