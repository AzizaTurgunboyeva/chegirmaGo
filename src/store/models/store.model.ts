import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../users/models/user.model";
import { StoreSocialLink } from "../../store-social-link/models/store-social-link.model";
import { District } from "../../district/models/district.model";
import { StoreSubscribe } from "../../store-subscribe/models/store-subscribe.model";
import { Discount } from "../../discounts/models/discount.model";

interface IStoreCreationAttr {
  name: string;
  location?: string;
  phone: string;
  ownerId: number;
  storeSocialLinkId: number;
  districtId: number;
}
@Table({ tableName: "store" })
export class Store extends Model<Store, IStoreCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string;
  @Column({
    type: DataType.STRING,
  })
  phone: string;
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  ownerId: number;
  @BelongsTo(() => User)
  user: User;
  
  @ForeignKey(() => StoreSocialLink)
  @Column({
    type: DataType.INTEGER,
  })
  storeSocialLinkId: number;
  @BelongsTo(() => StoreSocialLink)
  storeSocialLink: StoreSocialLink;

  @ForeignKey(() => District)
  @Column({
    type: DataType.INTEGER,
  })
  districtId: number;
  @BelongsTo(() => District)
  district: District;

  @HasMany(() => StoreSubscribe)
  storeSubscribe: StoreSubscribe[];

  @HasMany(() => Discount)
  discount: Discount[];
}
