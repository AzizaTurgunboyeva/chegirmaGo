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
import { CarService } from "./car.service";

@Update()
export class CarUpdate {
  constructor(private readonly carsService: CarService) {}

  @Command("cars")
  async OnCars(@Ctx() ctx: Context) {
    await this.carsService.OnCars(ctx);
  }
  @Hears("Mening mashinalarim")
  async OnMyCars(@Ctx() ctx: Context) {
    await this.carsService.OnMyCars(ctx);
  }

  @Hears("Yangi mashina qo'shish")
  async OnCommandNewCars(@Ctx() ctx: Context) {
    await this.carsService.OnMyNewCars(ctx);
  }

  @Action(/car_+\d+/)
  async onClickLocation(@Ctx() ctx: Context) {
    await this.carsService.onClickCar(ctx);
  }
  @Action(/del_+\d+/)
  async onDeleteLocation(@Ctx() ctx: Context) {
    await this.carsService.onDeleteCar(ctx);
  }
}
