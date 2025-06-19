import { prop, getModelForClass} from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class Meal {
  public _id!: mongoose.ObjectId;

  @prop({ required: true })
  public name?: string;

  @prop({ required: true })
  public calorie?: number;

  @prop({ required: true })
  public protein!: number;

  @prop({ required: true })
  public time?: string; // e.g., '08:30 AM'

  @prop()
  public barcode?: string;

  @prop({ default: Date.now })
  public createdAt?: Date;
}

export const MealModel = getModelForClass(Meal);