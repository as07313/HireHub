// app/middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

interface AuthUser {
  userId: string;
  type: 'candidate' | 'recruiter';
}

export async function Apiauth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization header' })
    }

    const token = authHeader.split(' ')[1].trim()
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as AuthUser
      console.log("decoded",decoded)
      return decoded
    } catch (verifyError) {
      console.error('Token verification error:', verifyError)
      return res.status(401).json({ error: 'Invalid token' })
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(500).json({ error: 'Authentication failed' })
  }
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