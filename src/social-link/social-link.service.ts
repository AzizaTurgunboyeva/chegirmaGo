import { Injectable } from '@nestjs/common';
import { CreateSocialLinkDto } from './dto/create-social-link.dto';
import { UpdateSocialLinkDto } from './dto/update-social-link.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SocialLink } from './models/social-link.model';

@Injectable()
export class SocialLinkService {
  constructor(@InjectModel(SocialLink) private readonly socialLinkModel:typeof SocialLink){}
  create(createSocialLinkDto: CreateSocialLinkDto) {
    return this.socialLinkModel.create(createSocialLinkDto)
  }

  findAll() {
    return this.socialLinkModel.findAll()
  }

  findOne(id: number) {
    return this.socialLinkModel.findByPk(id)
  }

  async update(id: number, updateSocialLinkDto: UpdateSocialLinkDto) {
    const updated = await this.socialLinkModel.update(updateSocialLinkDto, {
      where: { id },
      returning: true,
    });
    return updated[1][0];
  }

  remove(id: number) {
    return this.socialLinkModel.destroy({where:{id}})
  }
}
