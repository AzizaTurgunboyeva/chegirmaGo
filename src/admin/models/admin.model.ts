import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  is_creator: boolean;
  // hashed_refresh_token: string;
}
@Table({ tableName: "admin" })
export class Admin extends Model<Admin, IAdminCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(15),
  })
  name: string;
  @Column({
    type: DataType.STRING,
  })
  email: string;
  @Column({
    type: DataType.STRING,
  })
 password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue:true
  })
  is_active: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  is_creator: boolean;

  @Column({
    type: DataType.STRING
  })
  hashed_refresh_token: string;
}
