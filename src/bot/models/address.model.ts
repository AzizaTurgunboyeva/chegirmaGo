import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAddressCReationAttr {
  user_id: number | undefined;
  last_state: string
}
@Table({ tableName: "address" })
export class Address extends Model<Address, IAddressCReationAttr> {
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
  name: string | undefined;
  @Column({
    type: DataType.STRING,
  })
  address: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  location: string | undefined;

  @Column({
    type: DataType.STRING,
  })
  last_state: string
}
