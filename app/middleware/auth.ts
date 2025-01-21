// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { verify } from 'jsonwebtoken'

export async function auth(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new Error('No token provided')
    }

    // Verify token
    const decoded = verify(token, process.env.JWT_SECRET!)
    req.user = decoded
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}