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

  // Does not seem to update the diary correctly, fix later
  if (req.method === "DELETE") {
  try {
    console.log('Delete request received:');

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid meal ID' });
    }

    // Ensure the diary is populated
    const userId = session?.user.id;
    const user = await UserModel.findById(userId).populate({
      path: 'diary',
      model: 'Diary', // Ensure the Diary model is specified
    });

    if (!user || !user.diary) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    // Fetch the diary as a Mongoose document to access .save()
    const diaryDoc = await DiaryModel.findById(user.diary._id);

    if (!diaryDoc) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    const mealIndex = diaryDoc.mealList?.findIndex(meal => meal._id.toString() === id);
    if (mealIndex === undefined || mealIndex === -1) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const mealToDelete = diaryDoc.mealList![mealIndex];
    console.log('Meal to delete:', mealToDelete); 
    console.log('Meal index:', mealIndex);

    // Remove the meal from the mealList
    diaryDoc.mealList?.splice(mealIndex, 1);

    // Recalculate calories and protein arrays
    const lastCalories = diaryDoc.calories?.length ? diaryDoc.calories[diaryDoc.calories.length - 1] : 0;
    const lastProtein = diaryDoc.protein?.length ? diaryDoc.protein[diaryDoc.protein.length - 1] : 0;

    const updatedCalories = lastCalories - mealToDelete.eatenCalories!;
    const updatedProtein = lastProtein - mealToDelete.protein;

    diaryDoc.calories?.push(updatedCalories);
    diaryDoc.protein?.push(updatedProtein);

    console.log("Updated diary:", diaryDoc);

    // Update the diary in the database
    await diaryDoc.save();
    return res.status(200).json({ message: 'Meal deleted successfully' });
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