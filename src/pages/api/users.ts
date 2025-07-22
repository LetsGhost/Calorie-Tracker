import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';
import { UserModel } from '@/models/user';
import { withAuth } from '@/middleware/authMiddleware';
import { Session } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    await dbConnect();

    const session = (await withAuth(req, res)) as Session | null;

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

        // Check env variable if it is allowed to sign up
        if(process.env.ALLOW_SIGNUP !== 'true') {
          return res.status(403).json({ error: 'Sign up is not allowed' });
        }

        const user = await UserModel.create({ email, password, createdAt: new Date() });

        return res.status(201).json(user);
      } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Server error' });
      }
    }

    if(req.method === 'DELETE') {
      try {
        const userId = session?.user.id;

        if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await UserModel.findByIdAndDelete(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
      } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Server error' });
      }
    }

    res.setHeader('Allow', ['POST', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}