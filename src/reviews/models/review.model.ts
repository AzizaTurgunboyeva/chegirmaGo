import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript"
import { Discount } from "../../discounts/models/discount.model"
import { User } from "../../users/models/user.model"

interface IReviewCreationAttr{
        discountId:number
        userId:number
        text:string
        rating:number
        photo:string
}

@Table({ tableName: "review" })
export class Review extends Model<Review, IReviewCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.TEXT,
  })
  text: string;
  
  @ForeignKey(() => Discount)
  @Column({
    type: DataType.INTEGER,
  })
  discountId: number;

  @BelongsTo(() => Discount)
  discount: Discount;
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
