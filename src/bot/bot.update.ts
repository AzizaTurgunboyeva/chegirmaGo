import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { TelegrafExceptionFilter } from "../filters/telegraf-exception.filter";
import { AdminGuard } from "../guards/admin.guard";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}
  @Start()
  async onStart(@Ctx() ctx: Context) {
    await this.botService.start(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    await this.botService.onContact(ctx);

    // if ("contact" in ctx.message!) {
    //   console.log(ctx.message!.contact);
    //   await ctx.replyWithHTML(String(ctx.message.contact));
    //   await ctx.replyWithHTML(String(ctx.message.contact.first_name));
    //   await ctx.replyWithHTML(String(ctx.message.contact.last_name));
  }
  @Command("stop")
  async OnStop(@Ctx() ctx: Context) {
    await this.botService.onStop(ctx);
  }
  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }
  // //oxirida yozilishi kk
  @On("text")
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }
  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    this.botService.deleteUnCatchedMessage(ctx);
  }
  @UseFilters(TelegrafExceptionFilter)
  @UseGuards(AdminGuard)
  async onAdminGuardCommand(@Ctx() ctx: Context) {
    await this.botService.admin_menu(ctx, `<b> Xush kelibsiz , Admin</b>`);
  }
}
