import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import { DiaryModel } from '@/models/diary';
import { UserModel } from '@/models/user';
import { getServerSession } from '@/auth';
import { calculateCalories } from '@/utils/calorieCalculater';
import { Meal } from '@/models/diary';

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

  if (req.method === 'GET') {
    try {
      // Get the diary from the database
      const userId = session?.user.id;

      const user = await UserModel.findById(userId).populate('diary');

      if (!user || !user.diary) {
        return res.status(404).json({ error: 'Diary not found' });
      }

      const diary = user.diary;

      return res.status(200).json(diary);
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

export async function updateOrCreateDiary(mealData: Partial<Meal>, userId: string, kg: number) {
  await dbConnect();

  try {
    // Find the user by ID
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      throw new Error('User not found');
    }

    if (existingUser.diary) {
      // Update the existing diary
      const diary = await DiaryModel.findById(existingUser.diary._id);

      if (!diary) {
        throw new Error('Diary not found');
      }

      // Ensure meal.calorie and meal.protein are defined
      const calorie = mealData.calorie ?? 0; // Default to 0 if undefined
      const protein = mealData.protein ?? 0; // Default to 0 if undefined

      // Retrieve the last calories
      const lastCalories = diary?.calories?.length ? diary.calories[diary.calories.length - 1] : 0;

      // Calculate the calories for the new meal
      const totalCalories = calculateCalories(kg, calorie);
      diary?.calories?.push(lastCalories + totalCalories);

      const lastProtein = diary?.protein?.length ? diary.protein[diary.protein.length - 1] : 0;
      const totalProtein = calculateCalories(kg, protein);
      diary?.protein?.push(lastProtein + totalProtein);

      // Create a new Meal instance and add the `eatenCalories` field
      const meal = new Meal();
      meal.name = mealData.name!;
      meal.calorie = calorie;
      meal.protein = protein; // Ensure protein is always defined
      meal.time = mealData.time ?? new Date().toISOString();
      meal.barcode = mealData.barcode ?? '';
      meal.createdAt = new Date();
      meal.eatenCalories = totalCalories;

      diary?.mealList?.push(meal);

      // Save the updated diary
      await diary.save();
      return diary;
    } else {

      console.log("Should not get triggered")
      // Create a new diary for the user
      const calorie = mealData.calorie ?? 0; // Default to 0 if undefined
      const protein = mealData.protein ?? 0; // Default to 0 if undefined

      // Create a new Meal instance and add the `eatenCalories` field
      const meal = new Meal();
      meal.name = mealData.name!;
      meal.calorie = calorie;
      meal.protein = protein; // Ensure protein is always defined
      meal.time = mealData.time ?? new Date().toISOString();
      meal.barcode = mealData.barcode ?? '';
      meal.createdAt = new Date();
      meal.eatenCalories = calculateCalories(kg, calorie);

      const newDiary = await DiaryModel.create({
        mealList: [meal],
        calories: [meal.eatenCalories],
        protein: [(protein * kg) / 100],
        createdAt: new Date(),
      });

      // Update the user's diary reference
      existingUser.diary = newDiary;
      await existingUser.save();

      return newDiary;
    }
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Failed to update or create diary');
  }
}