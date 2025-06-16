import { prop, getModelForClass} from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import { User } from './user'; // Assuming User model is in the same directory

class Meal {
  @prop({ required: true })
  public name?: string;

  @prop({ required: true })
  public calories?: number;

  @prop()
  public protien?: number;

  @prop({ required: true })
  public time?: string; // e.g., '08:30 AM'

  @prop()
  public barcode?: string;

  @prop({ required: true, ref: () => 'User'})
  public userId?: Ref<User>

  @prop({ default: Date.now })
  public createdAt?: Date;
}

export const MealModel = getModelForClass(Meal);