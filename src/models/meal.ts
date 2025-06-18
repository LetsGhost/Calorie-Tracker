import { prop, getModelForClass} from '@typegoose/typegoose';

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

  @prop({ default: Date.now })
  public createdAt?: Date;
}

export const MealModel = getModelForClass(Meal);