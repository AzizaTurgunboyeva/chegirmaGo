import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { User } from "./users/models/user.model";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { RegionModule } from "./region/region.module";
import { DistrictModule } from "./district/district.module";
import { CategoryModule } from "./category/category.module";
import { SocialLinkModule } from "./social-link/social-link.module";
import { PhotoModule } from "./photo/photo.module";
import { DiscountTypeModule } from "./discount-type/discount-type.module";
import { StoreModule } from "./store/store.module";
import { StoreSubscribeModule } from "./store-subscribe/store-subscribe.module";
import { Category } from "./category/models/category.model";
import { DiscountType } from "./discount-type/models/discount-type.model";
import { District } from "./district/models/district.model";
import { Region } from "./region/models/region.model";
import { SocialLink } from "./social-link/models/social-link.model";
import { ReviewsModule } from "./reviews/reviews.module";
import { FavouritesModule } from "./favourites/favourites.module";
import { StoreSocialLinkModule } from "./store-social-link/store-social-link.module";
import { DiscountsModule } from "./discounts/discounts.module";
import { StoreSocialLink } from "./store-social-link/models/store-social-link.model";
import { Store } from "./store/models/store.model";
import { StoreSubscribe } from "./store-subscribe/models/store-subscribe.model";
import { Discount } from "./discounts/models/discount.model";
import { Favourite } from "./favourites/models/favourite.model";
import { Photo } from "./photo/models/photo.model";
import { Review } from "./reviews/models/review.model";

import { TelegrafModule } from "nestjs-telegraf";
import { BOT_NAME } from "./app.constant";
import { AdminModule } from "./admin/admin.module";
import { Admin } from "./admin/models/admin.model";
import { BotModule } from "./bot/bot.module";
import { Address } from "./bot/models/address.model";
import { Bot } from "./bot/models/bot.model";
import { OtpModule } from "./otp/otp.module";

import { Otp } from "./otp/models/otp.model";
import { Car } from "./bot/models/cars.model";
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      botName: BOT_NAME,
      useFactory: () => ({
        token: process.env.BOT_TOKEN || "1234",
        middlewares: [],
        include: [BotModule],
      }),
    }),

    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      username: process.env.POSTGRES_USER,
      port: Number(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Category,
        DiscountType,
        District,
        Region,
        SocialLink,
        StoreSocialLink,
        Store,
        StoreSubscribe,
        Discount,
        Favourite,
        Photo,
        Review,
        Admin,
        Address,
        Bot,
        Otp,
        Car
      ],
      autoLoadModels: true,
      sync: { alter: true }, //db bilan bog'lanish
      logging: false,
    }),
    UsersModule,
    AuthModule,
    MailModule,
    RegionModule,
    DistrictModule,
    CategoryModule,
    SocialLinkModule,
    PhotoModule,
    DiscountTypeModule,
    StoreModule,
    StoreSubscribeModule,
    ReviewsModule,
    FavouritesModule,
    StoreSocialLinkModule,
    DiscountsModule,
    AdminModule,
    BotModule,
    OtpModule,
    SmsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
