import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { SocialLink } from "../../social-link/models/social-link.model";
import { Store } from "../../store/models/store.model";

interface IStoreSocialLink {
  url: string;
  description: string;
  socialLinkId: number;
}

@Table({ tableName: "store_social_link" })
export class StoreSocialLink extends Model<StoreSocialLink, IStoreSocialLink> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  url: string;

  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @ForeignKey(() => SocialLink)
  @Column({
    type: DataType.INTEGER,
  })
  socialLinkId: number;
  @HasMany(()=>Store)
  store:Store[]
}
