import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Category from "App/Models/Category";
import User from "App/Models/User";

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @column()
  public content: string;

  @column()
  public online: boolean;

  @column()
  public thumbnail: string | null;

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>;

  @column()
  public categoryId: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column()
  public userId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
