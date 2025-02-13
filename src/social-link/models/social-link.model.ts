import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { StoreSocialLink } from "../../store-social-link/models/store-social-link.model";


interface ISocialLinkCreationAttr {
  name: string;
  icon: string;
}

@Table({ tableName: "social_link" })
export class SocialLink extends Model<SocialLink, ISocialLinkCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(20),
  })
  name: string;
  @HasMany(()=>StoreSocialLink)
  storeSocialLink:StoreSocialLink[]
}
