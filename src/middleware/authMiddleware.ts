import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from '@/auth';

export async function authenticate(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  try {
    const session = await getServerSession(req, res);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized: Please log in to access this resource.' });
    }

    // Attach the session to the request object for further use
    (req as any).session = session;

    // Proceed to the next handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}