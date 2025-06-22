import type { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = (await getServerSession(req, res)) as Session;

  if (req.method === 'POST') {
    try {
      const { name, calorie, protein, barcode, kg, origin } = req.body;
      console.log('req.body:', req.body);

      if (
        typeof name !== 'string' ||
        isNaN(parseFloat(calorie)) ||
        isNaN(parseFloat(protein)) ||
        !['Open Food Facts', 'User Created'].includes(origin)
      ) {
        console.error('Invalid input:', { name, calorie, protein, barcode, kg, origin });
        return res.status(400).json({ error: 'Invalid or missing fields' });
      }

      const meal = {
        name,
        calorie: parseFloat(calorie),
        protein: parseFloat(protein),
        time: new Date().toISOString(),
        barcode: barcode || '',
        origin,
        createdAt: new Date(),
      };

      const query: Record<string, unknown>[] = [{ name: meal.name }];

      if (meal.barcode && meal.barcode.trim() !== '') {
        query.push({ barcode: meal.barcode });
      }

      const existingMeal = await MealModel.findOne({ $or: query });
      console.log('Query for existing meal:', existingMeal);

      if (existingMeal) {
        // log the meal in the diary
        updateOrCreateDiary(existingMeal, session.user.id, kg);

        console.log('Meal already exists:', existingMeal);
        return res.status(200).json(existingMeal);
      }

      const newMeal = await MealModel.create(meal);

      const user = session.user;

      const diary = updateOrCreateDiary(newMeal, user.id, kg);

      if (!diary) {
        return res.status(500).json({ error: 'Failed to update or create diary' });
      }

      return res.status(201).json(newMeal);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const meals = await MealModel.find({}).sort({ createdAt: -1 });
      return res.status(200).json(meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}