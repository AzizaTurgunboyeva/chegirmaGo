import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IOtpCreationAttr {
  id: string;
  otp: string;
  phone_number: string;
  expiration_time: Date;

}

@Table({ tableName: "otp" })
export class Otp extends Model<Otp, IOtpCreationAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  id: string;
  @Column({
    type: DataType.STRING,
  })
  otp: string;
  @Column({
    type: DataType.STRING,
  })
  phone_number: string;
  @Column({
    type: DataType.BOOLEAN,
  })
  verified: boolean;
  @Column({
    type: DataType.DATE,
  })
  expiration_time: Date;
}
