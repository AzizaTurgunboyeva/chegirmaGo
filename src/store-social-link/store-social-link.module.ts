import { Module } from '@nestjs/common';
import { StoreSocialLinkService } from './store-social-link.service';
import { StoreSocialLinkController } from './store-social-link.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { StoreSocialLink } from './models/store-social-link.model';

@Module({
  imports:[SequelizeModule.forFeature([StoreSocialLink])],
  controllers: [StoreSocialLinkController],
  providers: [StoreSocialLinkService],
})
export class StoreSocialLinkModule {}
