import { getServerSession } from '@/auth';
import { Session } from 'inspector/promises';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function withAuth(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const excludedRoutes = [
    { path: '/api/user', method: 'POST' },
  ];

  if (excludedRoutes.some(route => route.path === req.url && route.method === req.method)) {
    return null;
  }

  const session = await getServerSession(req, res) as Session;

  if (!session) {
    res.status(401).json({ error: 'User is not authenticated' });
    return null;
  }

  // Check if the user has the required role(s)
  // No role based permissions are implemented yet
  /*
  if (roles.length > 0 && !roles.includes(session.user.role)) {
    res.status(403).json({
      error: 'Unauthorized access: User does not have the required privileges.',
    });
    return null;
  }
    */

  return session;
}