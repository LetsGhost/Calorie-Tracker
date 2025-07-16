import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { NextApiRequest, NextApiResponse } from 'next';

const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds
});

export async function rateLimit(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    await rateLimiter.consume(ip as string);
    next(); // Proceed to the next handler
  } catch (rateLimiterRes) {
    console.error('Rate limit exceeded:', rateLimiterRes);
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }
}