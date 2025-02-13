import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/sequelize";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { User } from "./models/user.model";
import { MailService } from "../mail/mail.service";
import { FindUserDto } from "./dto/find-user.dto";
import { Op } from "sequelize";
import { BotService } from "../bot/bot.service";
import * as otpGenerator from "otp-generator";

import { PhoneUserDto } from "./dto/phone-user.dto";
import { Otp } from "../otp/models/otp.model";
import { AddMinutesToDate } from "../helpers/addMinutes";
import { timeStamp } from "console";
import { decode, encode } from "../helpers/crypto";
import { Json } from "sequelize/types/utils";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { SmsService } from "../sms/sms.service";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Otp) private readonly otpModel: typeof Otp,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly botService: BotService,
    private readonly smsService: SmsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException("Password is not suitable");
    }
    const existingUser = await this.userModel.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }
    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const activation_link = uuid.v4();
    const newUser = await this.userModel.create({
      ...createUserDto,
      hashed_password,
      activation_link,
    });
    try {
      await this.mailService.sendMail(newUser);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Xat yuborishda xatolik");
    }
    return newUser;
  }

  async activate(link: string) {
    if (!link) {
      throw new BadRequestException("Activation link not found");
    }
    const updateUser = await this.userModel.update(
      { is_active: true },
      {
        where: {
          activation_link: link,
          is_active: false,
        },
        returning: true,
      }
    );
    if (!updateUser[1][0]) {
      throw new BadRequestException("User already activated");
    }
    const response = {
      message: "User activated successfully",
      user: updateUser[1][0].is_active,
    };
    return response;
  }
  findAll() {
    return this.userModel.findAll();
  }

  findOne(id: number) {
    return this.userModel.findByPk(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({
      where: { email: email },
    });
  }

  async updateRefreshToken(id: number, hashed_refresh_token: string | null) {
    const updateUser = await this.userModel.update(
      { hashed_refresh_token },
      {
        where: { id },
      }
    );
    return updateUser;
  }

  async findUser(findUserDto: FindUserDto) {
    const { name, email, phone } = findUserDto;
    const where = {};
    if (name) {
      where["name"] = {
        [Op.iLike]: `%${name}`,
      };
    }
    if (email) {
      where["email"] = {
        [Op.like]: `%${email}`,
      };
    }
    if (phone) {
      where["phone"] = {
        [Op.like]: `%${phone}`,
      };
    }
    console.log(where);

    const users = await this.userModel.findAll({ where });
    if (!users) {
      throw new NotFoundException("User not found");
    }
    return users;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    await user.update(updateUserDto);
    return user;
  }

  remove(id: number) {
    return this.userModel.destroy({ where: { id } });
  }

  async newOtp(phoneUserDto: PhoneUserDto) {
    const phone_number = phoneUserDto.phone;

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log(otp);
    //---------------------------bot----------------------------------
    const isSend = await this.botService.sendOtp(phone_number, otp);
    if (!isSend) {
      throw new BadRequestException("Avval ro'yxatdan o'ting");
    }


    //---------------------------sms-----------------------------------
    const response = await this.smsService.sendSms(phone_number, otp);
    if (response.status !== 200) {
      throw new ServiceUnavailableException("Otp yuborishda xatolik");
    }
    const message =
      `OTP kod yuborildi to ****` + phone_number.slice(phone_number.length - 4);

    //--------------------------------------------------------------
    const now = new Date();
    const expiration_time = AddMinutesToDate(now, 5);
    await this.otpModel.destroy({ where: { phone_number } });
    const newOtpData = await this.otpModel.create({
      id: uuid.v4(),
      otp,
      phone_number,

      expiration_time,
    });
    const details = {
      timestamp: now,
      phone_number,
      otp_id: newOtpData.id,
    };

    const encodedData = await encode(JSON.stringify(details));
    return {
      message: "OTP botga yuborildi",
      messageSms:message,
      verification_key: encodedData,
      
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { verification_key, phone, otp } = verifyOtpDto;

    const currentData = new Date();
    const decodedData = await decode(verification_key);
    const details = JSON.parse(decodedData);
    if (details.phone) {
      throw new BadRequestException("OTP bu telefon raqamiga yuborilmagan");
    }

    const resultOTP = await this.otpModel.findByPk(details.otp_id);

    if (resultOTP == null) {
      throw new BadRequestException("Bunday otp mavjud emas");
    }

    if (resultOTP.verified) {
      throw new BadRequestException("Bunday OTP avval ishlatilgan");
    }

    if (resultOTP.expiration_time < currentData) {
      throw new BadRequestException("OTP vaqti tugagan");
    }

    if (resultOTP.otp != otp) {
      throw new BadRequestException("OTP mos emas");
    }

    const user = await this.userModel.update(
      { is_owner: true },
      { where: { phone }, returning: true }
    );

    if (!user[1][0]) {
      throw new BadRequestException("Bunday raqamli foydalanuvchi mavjud emas");
    }
    await this.otpModel.update(
      { verified: true },
      { where: { id: details.otp_id } }
    );
    return {
      message: "Tabriklaymiz, siz owner bo'ldingiz",
    };
  }
}
