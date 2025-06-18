import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  await dbConnect();

  if(req.method === 'POST') {
    try {
      const { name, calorie, protein} = req.body

      

    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}