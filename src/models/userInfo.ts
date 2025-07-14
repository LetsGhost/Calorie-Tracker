import { prop, getModelForClass } from '@typegoose/typegoose';
import mongoose from 'mongoose';

export class UserInfo {
  public _id!: mongoose.ObjectId;

  @prop({ required: true })
  public height!: number;

  @prop({required: true})
  public weight!: number;

  @prop({required: true})
  public age!: Date;

  @prop({required: true})
  public calorieGoal!: number;

  @prop({ default: Date.now })
  public createdAt?: Date;


}

export const UserInfoModel = getModelForClass(UserInfo);