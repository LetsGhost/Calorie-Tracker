import { prop, getModelForClass} from '@typegoose/typegoose';
import { ObjectId } from 'mongoose';

class Diary {
  @prop({required: true})
  public mealList?: ObjectId[];

  @prop({required: true})
  public calories?: number[];

  @prop({required: true})
  public protein?: number[];

  @prop({required: true})
  public createdAt?: Date;
}

export const DiaryModel = getModelForClass(Diary);