import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  await dbConnect();

  if(req.method === 'POST') {
    try { 
      

      return res.status(201);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

export function createUserInfo(height: number, weight: number, age: Date, calorieGoal: number) {
  try{
    
  } catch(error) {
    console.log("Error in userInfo: " + error)
    throw new Error('Failed to create userInfo');
  }
}