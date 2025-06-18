import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';
import jwt from 'jsonwebtoken';
import { User, UserModel } from '@/models/user';
import { compare } from 'bcrypt';
import cookie from 'cookie';

//
// Rewrite this whole thing
// You have to create a auth.ts in your root directory and then use one of Next.js's built-in authentication methods

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  await dbConnect();

  if(req.method === 'POST') {
    try {
      
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await UserModel.findOne<User>({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Check password (assuming you have a method to compare hashed passwords)
      const isPasswordValid = await compare(password, user.password as string);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Create JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '3h',
      });

      // Set cookie with token
      res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 60 * 60 * 3, // 3 hours
      }));

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}