import { BadRequestException, Body, Injectable } from "@nestjs/common";
import { Admin } from "./models/admin.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";


@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin) private adminModel: typeof Admin) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    const existingAdmin = await this.adminModel.findOne({
          where: { email: createAdminDto.email },
        });
        if (existingAdmin) {
          throw new BadRequestException("Admin already exists");
        }

    const newAdmin = await this.adminModel.create(createAdminDto);
    return newAdmin;
  }

  async findAll(): Promise<Admin[]> {
    // return this.adminModel await shartmas o'zgaruvchiga yuklasak await
    return this.adminModel.findAll();
  }

  async findById(id: number): Promise<Admin | null> {
    return this.adminModel.findOne({ where: { id } });
  }

  findAdminByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({
      where: { email },
    });
  }

  async updateById(
    id: number,
    updateLangDto: UpdateAdminDto
  ): Promise<Admin | null> {
    const Admin = await this.adminModel.update(updateLangDto, {
      where: { id },
      returning: true,
    });
    console.log(Admin);
    return Admin[1][0];
  }

  async deleteById(id: number): Promise<string> {
    const res = await this.adminModel.destroy({ where: { id } });
    if (res == 1) {
      return `${id} o'chirildi`;
    }
    return `Bunday ma'lumot topilmadi`;
  }
}
