import { Injectable } from "@nestjs/common";
import { Bot } from "./models/bot.model";
import { InjectModel } from "@nestjs/sequelize";
import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constant";
import { Address } from "./models/address.model";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Address) private readonly addressModel: typeof Address,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context> //userni ID ko'rsatiladi replysiz yozish
  ) {}
  async start(ctx: Context) {
    const user_id = ctx.from?.id;
    const user = await this.botModel.findByPk(user_id);
    if (!user) {
      await this.botModel.create({
        user_id,
        username: ctx.from?.username,
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
        lang: ctx.from?.language_code,
      });
      await ctx.reply(
        `Iltimos,<b> 📞Telefon raqamni yuborish tugmasini bosing</b>`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [
              Markup.button.contactRequest(
                "📞Telefon raqamni yuborish tugmasini bosing"
              ),
            ],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else if (!user.status) {
      await ctx.reply(
        `Iltimos,<b> 📞Telefon raqamni yuborish tugmasini bosing</b>`,
        {
          parse_mode: "HTML",
          ...Markup.keyboard([
            [
              Markup.button.contactRequest(
                "📞Telefon raqamni yuborish tugmasini bosing"
              ),
            ],
          ])
            .resize()
            .oneTime(),
        }
      );
    } else {
      await this.bot.telegram.sendChatAction(user_id!, "typing");
      await ctx.reply(
        `Ushbu bot promokod va chegirmalar haqida ma'lumot beradi`,
        {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        }
      );
    }
  }

  async onContact(ctx: Context) {
    if ("contact" in ctx.message!) {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);

      if (!user) {
        await ctx.reply(`Iltimos,<b>Start</b> tugmasini bosing`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["/start"]])
            .resize()
            .oneTime(),
        });
      } else if (ctx.message.contact.user_id != user_id) {
        await ctx.reply(
          `Iltimos, o'zingizning telefon raqamingizni yuboring `,
          {
            parse_mode: "HTML",
            ...Markup.keyboard([
              [
                Markup.button.contactRequest(
                  "📞Telefon raqamni yuborish tugmasini bosing"
                ),
              ],
            ])
              .resize()
              .oneTime(),
          }
        );
      } else {
        let phone = ctx.message.contact.phone_number;
        if (phone[0] != "+") {
          phone = "+" + phone;
        }

        user.phone_number = phone;
        user.status = true;
        await ctx.reply(
          `<b>Tabriklaymiz</b>, sizning akkountingiz faollashtirildi`,
          {
            parse_mode: "HTML",
            ...Markup.removeKeyboard(),
          }
        );
        await user.save();
      }
    }
  }

  async deleteUnCatchedMessage(ctx: Context) {
    try {
      const message_id = ctx.message!.message_id;
      console.log(message_id);
      await ctx.deleteMessage(message_id);
    } catch (error) {
      console.log("Uncatched error", error);
    }
  }

  async onStop(ctx: Context) {
    try {
      const user_id = ctx.from?.id;
      const user = await this.botModel.findByPk(user_id);
      if (user && user.status) {
        user.status = false;
        user.phone_number = "";
        await user.save();
        await ctx.reply(`Sizni yana kutib qolamiz`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log("onstop err", error);
    }
  }
  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`Siz ro'yxatdan o'tmagansiz`, {
            parse_mode: "HTML",
            ...Markup.keyboard([
              ["/start"], //inline
            ]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]], //oxirgi adderessni oladi
          });
          if (address && address.last_state == "location") {
            address.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`;
            address.last_state = "finish";
            await address.save();
            await ctx.reply("Manzil saqlandi", {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Mening manzillarim", "Yangi manzil qo'shish"],
              ]).resize(),
            });
          }
        }
      }
    } catch (error) {
      console.log("onLocation err", error);
    }
  }
  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from?.id;
        const user = await this.botModel.findByPk(user_id);
        if (!user || !user.status) {
          await ctx.reply(`Siz ro'yxatdan o'tmagansiz`, {
            parse_mode: "HTML",
            ...Markup.keyboard([
              ["/start"], //inline
            ]).resize(),
          });
        } else {
          const address = await this.addressModel.findOne({
            where: { user_id },
            order: [["id", "DESC"]], //oxirgi adderessni oladi
          });
          if (address && address.last_state !== "finish") {
            if (address.last_state == "name") {
              address.name = ctx.message.text;
              address.last_state = "address";
              await address.save();
              await ctx.reply("Manzilingizni kiriting:", {
                parse_mode: "HTML",
                ...Markup.removeKeyboard(),
              });
            } else if (address.last_state == "address") {
              address.address = ctx.message.text;
              address.last_state = "location";
              await address.save();
              await ctx.reply("Lokatsiyangizni yuboring:", {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  [Markup.button.locationRequest("📍Lokatsangizni yuboring")],
                ]).resize(),
              });
            }
          }
        }
      }
    } catch (error) {
      console.log("onTextda error", error);
    }
  }

  async sendOtp(
    phone_number: string,
    OTP: string
  ): Promise<boolean | undefined> {
    try {
      const user = await this.botModel.findOne({ where: { phone_number } });
      if (!user || !user.status) {
        return false;
      }
      await this.bot.telegram.sendMessage(
        user.user_id!,
        `Verifcation OTP code: ${OTP}`
      );
      return true;
    } catch (error) {
      console.log("senOTPda error", error);
    }
  }

  async admin_menu(ctx: Context, menu_text= `<b>Admin menyusi</b>`) {
    try {
      await ctx.reply(menu_text, {
        parse_mode: "HTML",
        ...Markup.keyboard([["Mijozlar", "Ustalar"]])
          .oneTime()
          .resize(),
      });
    } catch (error) {
      console.log("admin menyudagi xato", error);
    }
  }
}
