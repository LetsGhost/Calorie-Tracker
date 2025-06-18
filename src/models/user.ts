import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import type { Ref } from '@typegoose/typegoose/lib/types';
import { Diary } from './diary';

@pre<User>('save', async function () {
  if (this.isModified('password')) {  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
  }
})

export class User {
  @prop({ required: true })
  public email?: string;

  @prop({ required: true })
  public password?: string;

  @prop({ required: true })
  public createdAt?: Date;

  @prop({ required: true, ref: () => 'Diary'})
  public diary?: Ref<Diary>;

}


export const UserModel = getModelForClass(User);