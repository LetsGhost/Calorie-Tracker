import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';
import { UserInfoModel } from '@/models/userInfo';
import { UserModel } from '@/models/user';
import { withAuth } from '@/middleware/authMiddleware';

type Session = {
  user: {
    id: string;
    name?: string;
    email?: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  await dbConnect();

  const session = (await withAuth(req, res)) as Session | null;

  if(req.method === 'POST') {
    try { 
      const { height, weight, dot, calorieGoal } = req.body;
      const userId = session?.user.id;

      if (!height || !weight || !dot || !calorieGoal || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate userId
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userInfo = await createUserInfo(height, weight, new Date(dot), calorieGoal, userId);

      if (!userInfo) {
        return res.status(400).json({ error: 'Failed to create user info' });
      }

      // add the refrence to the user
      user.userInfo = userInfo._id as unknown as typeof user.userInfo;
      await user.save();

      res.status(201).json({ message: 'User info created successfully', userInfo });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  else if (req.method === 'GET') {
    try {
      const userId = session?.user.id;

      const userInfo = await UserModel.findById(userId).populate('userInfo');
      if (!userInfo) {
        return res.status(404).json({ error: 'User info not found' });
      }

      res.status(200).json(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST', 'GET']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

export async function createUserInfo(height: number, weight: number, dot: Date, calorieGoal: number, userId: string) {
  try{
    if(!height || !weight || !dot || !calorieGoal) {
      throw new Error('All fields are required');
    }

    const userInfo = {
      height,
      weight,
      dot,
      calorieGoal
    };

    const user = UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const newUserInfo = await UserInfoModel.create({
      ...userInfo,
    })

    return newUserInfo;
  } catch(error) {
    console.log("Error in userInfo: " + error)
    throw new Error('Failed to create userInfo');
  }
}