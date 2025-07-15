import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';
import { UserInfo } from '@/models/userInfo';
import { UserModel } from '@/models/user';

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

export function createUserInfo(height: number, weight: number, age: Date, calorieGoal: number, userId: string) {
  try{
    if(!height || !weight || !age || !calorieGoal) {
      throw new Error('All fields are required');
    }

    const userInfo = {
      height,
      weight,
      age,
      calorieGoal
    };

    const user = UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    

    // Here you would typically save userInfo to the database

  } catch(error) {
    console.log("Error in userInfo: " + error)
    throw new Error('Failed to create userInfo');
  }
}