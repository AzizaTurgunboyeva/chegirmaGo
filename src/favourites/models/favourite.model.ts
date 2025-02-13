import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { User } from "../../users/models/user.model";
import { Discount } from "../../discounts/models/discount.model";

interface IFavouriteCreationAttr{
    userId:number
    discountId:number
}

@Table({ tableName: "favourite" })
export class Favourite extends Model<Favourite, IFavouriteCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  discountId: number;

  @BelongsTo(() => Discount)
  discount: Discount;
}
