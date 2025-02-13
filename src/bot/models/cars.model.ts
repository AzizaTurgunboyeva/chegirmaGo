import { Column, DataType, Model, Table } from "sequelize-typescript";

interface ICarCReationAttr {
  user_id: number | undefined;
  last_state: string
}
@Table({ tableName: "cars" })
export class Car extends Model<Car, ICarCReationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number | undefined;

  @Column({
    type: DataType.BIGINT,
  })
  user_id: number | undefined;
  @Column({
    type: DataType.STRING,
  })
  car_number: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  model: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  color: string | undefined;

  @Column({
    type: DataType.INTEGER,
  })
  year: number | undefined;

  @Column({
    type: DataType.STRING,
  })
  last_state: string;
}
