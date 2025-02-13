import { ApiProperty } from "@nestjs/swagger";

import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Discount } from "../../discounts/models/discount.model";

interface ICategoryCreationAttr {
  name: string;
  description: string;
  parentCategoryId: number;
}
@Table({ tableName: "category" })
export class Category extends Model<Category, ICategoryCreationAttr> {
  @ApiProperty({ example: 1, description: "ID" })
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.TEXT,
  })
  description: string;
  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentCategoryId: number;
  @BelongsTo(()=>Category,{foreignKey:"parentCategoryId"})
  parent:Category

  
  @HasMany(()=>Category,"parentCategoryId")
  children:Category[]

  @HasMany(()=>Discount)
  discount:Discount[]
}
