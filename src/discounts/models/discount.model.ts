import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Store } from "../../store/models/store.model";
import { Category } from "../../category/models/category.model";
import { DiscountType } from "../../discount-type/models/discount-type.model";
import { Favourite } from "../../favourites/models/favourite.model";
import { Photo } from "../../photo/models/photo.model";
import { Review } from "../../reviews/models/review.model";

interface IDiscountCreationAttr{
      storeId: number;
      title: string;
      description?: string;
      discount_percent: number;
      start_date: string;
      end_date: string;
      categoryId: number;
      discount_value: number;
      special_link: string;
      is_active: boolean;
      discountTypeId: number;
}

@Table({ tableName: "discount" })
export class Discount extends Model<Discount, IDiscountCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;
  @Column({
    type: DataType.DECIMAL(15, 2),
  })
  discount_percent: number;
  @Column({
    type: DataType.STRING,
  })
  start_date: string;
  @Column({
    type: DataType.STRING,
  })
  end_date: string;
  @Column({
    type: DataType.INTEGER,
  })
  discount_value: number;
  @Column({
    type: DataType.STRING,
  })
  special_link: string;
  @Column({
    type: DataType.BOOLEAN,
  })
  is_active: boolean;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.INTEGER,
  })
  storeId: number;

  @BelongsTo(() => Store)
  store: Store;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
  })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => DiscountType)
  @Column({
    type: DataType.INTEGER,
  })
  discountTypeId: number;

  @BelongsTo(() => DiscountType)
  discountType: DiscountType;
  @HasMany(() => Favourite)
  favourite: Favourite[];

  @HasMany(() => Photo)
  photo: Photo[];

  @HasMany(() => Review)
  review: Review[];
}
