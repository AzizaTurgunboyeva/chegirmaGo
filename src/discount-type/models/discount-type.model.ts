import { ApiProperty } from "@nestjs/swagger";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discounts/models/discount.model";

interface IDiscountTypeCreationAtrr {
  name: string;
  description: string
}

@Table({ tableName: "discount-type" })
export class DiscountType extends Model<
  DiscountType,
  IDiscountTypeCreationAtrr
> {
  @ApiProperty({ example: 1, description: "ID" })
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
    type: DataType.TEXT,
  })
  description: string;
  @HasMany(() => Discount)
  discount: Discount[];

}
