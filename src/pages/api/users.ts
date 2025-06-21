import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  await dbConnect();

  if(req.method === 'POST') {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Missing email or password' });
      }

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      console.log('Existing user:', existingUser);
      if (existingUser) { 
        return res.status(409).json({ error: 'User already exists' });
      }

      const user = await UserModel.create({ email, password, createdAt: new Date() });

      return res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}