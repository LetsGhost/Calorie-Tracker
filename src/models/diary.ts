import { prop, getModelForClass } from '@typegoose/typegoose';

export class Meal {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public calorie!: number;

  @prop({ required: true })
  public protein!: number;

  @prop({ required: true })
  public time!: string;

  @prop()
  public barcode?: string;

  @prop({ default: Date.now })
  public createdAt?: Date;

  @prop() // Extra field specific to mealList
  public eatenCalories?: number;
}

export class Diary {
  @prop({ required: true, type: () => [Meal] }) // Reference the Meal class
  public mealList?: Meal[];

  @prop({ required: true })
  public calories?: number[];

  @prop({ required: true })
  public protein?: number[];

  @prop({ required: true })
  public createdAt?: Date;
}

export const DiaryModel = getModelForClass(Diary);