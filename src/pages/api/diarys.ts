import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb';
import { DiaryModel } from '@/models/diary';
import { UserModel } from '@/models/user';
import { getServerSession } from '@/auth';
import { calculateCalories } from '@/utils/calorieCalculater';
import { Meal } from '@/models/meal';

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
      const { meal } = req.body
      const { user } = session

      if(!meal) {
        return res.status(400).json({ error: 'Meal data is required' });
      }

      // Check if the user has an diary for this day
      const existingUser = await UserModel.findById(user.id)

      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      if(existingUser.diary) {
        // Update the existing diary
        const diary = await DiaryModel.findById(existingUser.diary._id);

        diary?.mealList?.push(meal)
        
        // Retrieve the last calories
        const lastCalories = diary?.calories?.length ? diary.calories[diary.calories.length - 1] : 0;
        
        // Calculate the calories for the new meal
        const totalCalories = calculateCalories(meal.weight, meal.calorie)
        diary?.calories?.push(lastCalories + totalCalories);

        const lastProtein = diary?.protein?.length ? diary.protein[diary.protein.length - 1] : 0;
        const totalProtein = (meal.protein * meal.weight) / 100;
        diary?.protein?.push(lastProtein + totalProtein);

        // Update the diary with the new meal
        await diary?.save();
        return res.status(200).json(diary);
      } else {
        // Create a new diary for the user
        const newDiary = await DiaryModel.create({
          mealList: [meal],
          calories: [calculateCalories(meal.weight, meal.calorie)],
          protein: [(meal.protein * meal.weight) / 100],
          createdAt: new Date(),
        });

        // Update the user's diary reference
        existingUser.diary = newDiary;
        await existingUser.save();

        return res.status(201).json(newDiary);
      }
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}

export async function updateOrCreateDiary(meal: Meal, userId: string, kg: number) {
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

      diary?.mealList?.push(meal._id);

      console.log('Meal added to diary:', meal);

      // Ensure meal.calorie and meal.protein are defined
      const calorie = meal.calorie ?? 0; // Default to 0 if undefined
      const protein = meal.protein ?? 0; // Default to 0 if undefined

      // Retrieve the last calories
      const lastCalories = diary?.calories?.length ? diary.calories[diary.calories.length - 1] : 0;

      // Calculate the calories for the new meal
      const totalCalories = calculateCalories(kg, calorie);
      diary?.calories?.push(lastCalories + totalCalories);

      const lastProtein = diary?.protein?.length ? diary.protein[diary.protein.length - 1] : 0;
      const totalProtein = calculateCalories(kg, protein);
      diary?.protein?.push(lastProtein + totalProtein);

      console.log('Updated diary:', diary);
      console.log(protein)

      // Save the updated diary
      await diary.save();
      return diary;
    } else {
      // Create a new diary for the user
      const calorie = meal.calorie ?? 0; // Default to 0 if undefined
      const protein = meal.protein ?? 0; // Default to 0 if undefined
      const weight = meal.calorie ?? 0; // Default to 0 if undefined

      const newDiary = await DiaryModel.create({
        mealList: [meal],
        calories: [calculateCalories(weight, calorie)],
        protein: [(protein * weight) / 100],
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