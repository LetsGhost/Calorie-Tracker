import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';
import { MealModel } from '@/models/meal';
import { updateOrCreateDiary } from './diarys';
import { getServerSession } from '@/auth';

type Session = {
  user: {
    id: string;
    name?: string;
    email?: string;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  await dbConnect();

  const session = (await getServerSession(req, res)) as Session;

  if(req.method === 'POST') {
    try {
      // TODO: Protein does not get saved to the db fix!

      const { name, calorie, protein, barcode, kg} = req.body

      if (typeof name !== 'string' || isNaN(parseFloat(calorie)) || isNaN(parseFloat(protein))) {
        return res.status(400).json({ error: 'Invalid or missing fields' });
      }

      const meal = {
        name,
        calorie: parseFloat(calorie),
        protein: parseFloat(protein),
        time: new Date().toISOString(),
        barcode: barcode || '',
        createdAt: new Date(),
      };

      //console.log('1Meal object to be saved:', meal);

      const query: Record<string, unknown>[] = [{ name: meal.name }];

      if (meal.barcode && meal.barcode.trim() !== '') {
        query.push({ barcode: meal.barcode });
      }

      const existingMeal = await MealModel.findOne({ $or: query });

      //console.log('2Meal object to be saved:', meal);

      if (existingMeal) {
        console.log('Meal already exists:');
        return res.status(409).json({ error: 'Meal already exists' });
      }

      //console.log('3Meal object to be saved:', meal);

      const newMeal = await MealModel.create(meal);

      //console.log('4Meal object to be saved:', meal);
      //console.log('5Meal object to be saved:', newMeal);

      // Retrieve user from session
      const user = session.user;

      // Call the diary API to add the meal
      const diary = updateOrCreateDiary(newMeal, user.id, kg);


      if (!diary) {
        return res.status(500).json({ error: 'Failed to update or create diary' });
      }

      
      return res.status(201).json(newMeal);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}