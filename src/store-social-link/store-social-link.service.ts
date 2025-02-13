import { Injectable } from "@nestjs/common";
import { CreateStoreSocialLinkDto } from "./dto/create-store-social-link.dto";
import { UpdateStoreSocialLinkDto } from "./dto/update-store-social-link.dto";
import { InjectModel } from "@nestjs/sequelize";
import { StoreSocialLink } from "./models/store-social-link.model";

@Injectable()
export class StoreSocialLinkService {
  constructor(
    @InjectModel(StoreSocialLink)
    private readonly storeSocialLinkModel: typeof StoreSocialLink
  ) {}
  create(createStoreSocialLinkDto: CreateStoreSocialLinkDto) {
    return this.storeSocialLinkModel.create();
  }

  findAll() {
    return this.storeSocialLinkModel.findAll();
  }

  findOne(id: number) {
    return this.storeSocialLinkModel.findByPk(id);
  }

  async update(id: number, updateStoreSocialLinkDto: UpdateStoreSocialLinkDto) {
    const updated = await this.storeSocialLinkModel.update(
      updateStoreSocialLinkDto,
      {
        where: { id },
        returning: true,
      }
    );
    return updated[1][0];
  }

  remove(id: number) {
    return this.storeSocialLinkModel.destroy({ where: { id } });
  }
}
