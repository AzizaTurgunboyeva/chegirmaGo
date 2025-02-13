import { Injectable } from "@nestjs/common";
import { Bot } from "./models/bot.model";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constant";
import { Car } from "./models/cars.model";

@Injectable()
export class CarService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Car) private readonly carModel: typeof Car,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context> //userni ID ko'rsatiladi replysiz yozish
  ) {}
  async OnCars(ctx: Context) {
    try {
      await ctx.reply("Foydalanuvchi mashinalari", {
        parse_mode: "HTML",
        ...Markup.keyboard([
          ["Mening mashinalarim"],
          ["Yangi mashina qo'shish", "Tahrirlash"],
        ]).resize(),
      });
    } catch (error) {
      console.log("OnCars", error);
    }
  }
  async  OnMyNewCars(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || user.status != true) {
        await ctx.reply(`Siz ro'yxatdan o'tmagansiz`, {
          parse_mode: "HTML",
          ...Markup.keyboard([
            ["/start"], //inline
          ]).resize(),
        });
      } else {
        await this.carModel.create({ user_id, last_state: "model" });
        await ctx.replyWithHTML(
          `Yangi mashinangiz modelini kiriting (masalan, <i>spark</i>)`+
          
          {
            parse_mode: "HTML",
            ...Markup.removeKeyboard(),
          }
        );
      }
    } catch (error) {
      console.log("onCommandNewAddress err", error);
    }
  }


  async OnMyCars(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user || !user.status) {
        await ctx.reply(`Siz ro'yxatdan o'tmagansiz`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]]).resize(),
        });
      } else {
        const cars = await this.carModel.findAll({
          where: { user_id, last_state: "finish" },
        });
        cars.forEach(async (car) => {
          await ctx.replyWithHTML(
            `<b> Mashina modeli:</b> ${car.model}` +
              ` <b> Mashina raqami:</b> ${car.car_number} ` +
              ` <b> Mashina rangi:</b> ${car.color} ` +
              ` <b> Yili: </b> ${car.year} `,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Mashinani ko'rish",
                      callback_data: `car_${car.id}`,
                    },
                    {
                      text: "Mashinani o'chirish",
                      callback_data: `del_${car.id}`,
                    },
                  ],
                ],
              },
            }
          );
        });
      }
    } catch (error) {
      console.log("OnMyCars", error);
    }
  }

  async onClickCar(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const contextMessage = ctx.callbackQuery!["message"];
      const car_id = contextAction.split("_")[1];
      const cars = await this.carModel.findByPk(car_id);
      //tekshir lokatsiyani
      await ctx.deleteMessage(contextMessage?.message_id);
      // await ctx.deleteMessage(contextMessage?.message_id! -1)//so'ziniyam o'chiradi, idsi yo'q bolsa xato beradi
    } catch (error) {
      console.log("onAddress err", error);
    }
  }

  async onDeleteCar(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const car_id = contextAction.split("_")[1];
      const cars = await this.carModel.findByPk(car_id);
      if (!cars || !cars.car_number) {
        return ctx.reply("Mashina topilmadi yoki noto'g'ri formatda.");
      }

      await ctx.editMessageText(
        `Mashina o'chirildi: ${cars.car_number || "Noma'lum mashina"}`
      ); //2-usul bosilganga o'chirilganchiqadi
    } catch (error) {
      console.log("onDeleteCar err", error);
    }
  }
 
}
