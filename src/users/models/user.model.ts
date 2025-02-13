import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Store } from "../../store/models/store.model";
import { Favourite } from "../../favourites/models/favourite.model";
import { StoreSubscribe } from "../../store-subscribe/models/store-subscribe.model";
import { Review } from "../../reviews/models/review.model";

interface IUserCreationAttr {
  name: string;
  phone: string;
  email: string;
  hashed_password: string;
  activation_link: string;
   //frontdan keladi
  // is_active:boolean
  // is_owner:boolean
  // hashed_refresh_token:string
}

@Table({ tableName: "user" })
export class User extends Model<User, IUserCreationAttr> {
  @ApiProperty({ example: 1, description: "User ID" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING(30),
    allowNull: false,
  })
  name: string;
  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    unique: true,
  })
  phone: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;
  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_active: boolean;//gmail

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_owner: boolean;//botda

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string | null;

  @Column({
    type: DataType.STRING,
  })
  activation_link: string;

  @HasMany(() => Store)
  store: Store[];
  @HasMany(() => Favourite)
  favourite: Favourite[];

  @HasMany(() => StoreSubscribe)
  storeSubscribe: StoreSubscribe[];

  @HasMany(() => Review)
  review: Review[];
}
