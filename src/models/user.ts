import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import type { Ref } from '@typegoose/typegoose/lib/types';
import { Diary } from './diary';
import mongoose from 'mongoose';
import { UserInfo } from './userInfo';

@pre<User>('save', async function () {
  if (this.isModified('password')) {  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  }
})

export class User {
  public _id!: mongoose.ObjectId;

  @prop({ required: true })
  public email?: string;

  @prop({ required: true })
  public password?: string;

  @prop({ required: true })
  public createdAt?: Date;

  @prop({ required: true })
  public oldDiarys: oldDiarys[] = [];

  @prop({ ref: () => 'UserInfo'})
  public userInfo?: Ref<UserInfo>;

  @prop({ ref: () => 'Diary'})
  public diary?: Ref<Diary>;
}

export class oldDiarys {
  @prop({ required: true })
  public diaryId?: string;

  @prop({ required: true })
  public createdAt?: Date;
}


export const UserModel = getModelForClass(User);