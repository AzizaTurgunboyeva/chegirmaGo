import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { User } from "../users/models/user.model";
import { CreateUserDto } from "../users/dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { SignInDto } from "./dto/sign-in.dto";
import { Response } from "express";
import { Admin } from "../admin/models/admin.model";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { AdminService } from "../admin/admin.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly adminService: AdminService
  ) {}
  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async signUp(createUserDto: CreateUserDto) {
    const candidate = await this.userService.findByEmail(createUserDto.email);
    if (candidate) {
      throw new BadRequestException("Foydalanuvchi allaqachon mavjud");
    }

    const newUser = await this.userService.create(createUserDto);
    const response = {
      message: "Tabriklaymiz tizimga qo'shildingiz",
      userId: newUser.id,
    };
    return response;
  }

  async signIn(signInDto: SignInDto, res: Response) {
    //identifikatsiya
    const user = await this.userService.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException("Foydalanuvchi topilmadi");
    }

    if (!user.is_active) {
      throw new BadRequestException("Foydalanuvchi faol emas");
    }
    //autentifikatsiya
    const isMatchPassword = await bcrypt.compare(
      signInDto.password,
      user.hashed_password
    );
    if (!isMatchPassword) {
      throw new BadRequestException("Password don't match");
    }
    const tokens = await this.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updateUser = await this.userService.updateRefreshToken(
      user.id,
      hashed_refresh_token
    );

    if (!updateUser) {
      throw new InternalServerErrorException("tokenni saqlashda xatolik");
    }
    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: "User logged in",
      userId: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  async signOut(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException("User not verified");
    }
    const hashed_refresh_token = null;
    await this.userService.updateRefreshToken(
      userData.id,
      hashed_refresh_token
    );
    res.clearCookie("refresh_token");
    const response = {
      message: "Usser logged out successfully",
    };
    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);
    if (userId !== decodedToken["id"]) {
      throw new BadRequestException("Not allowed");
    }
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException("User not found");
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token
    );
    if (!tokenMatch) {
      throw new ForbiddenException("Forbidden");
    }

    const tokens = await this.getTokens(user);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.userService.updateRefreshToken(user.id, hashed_refresh_token);

    res.cookie("refresh_token", tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const response = {
      message: "User refreshed",
      user: user.id,
      access_token: tokens.access_token,
    };
    return response;
  }

  //--------------------------------------------------------
  private async generateTokenAdmin(admin: Admin) {
    const payload = {
      id: admin.id,
      email: admin.email,
      is_active: admin.is_active,
      is_creator: admin.is_creator,
    };
    console.log(payload);
    return { token: this.jwtService.sign(payload) };
  }

  async signUpAdmin(createAdminDto: CreateAdminDto) {
    const candidate = await this.adminService.findAdminByEmail(
      createAdminDto.email
    );
    if (candidate) {
      throw new BadRequestException("Already exist");
    }

    if (!createAdminDto.password) {
      throw new BadRequestException("Password is required");
    }

    createAdminDto.password = await bcrypt.hash(createAdminDto.password, 7);

    const newAdmin = await this.adminService.createAdmin(createAdminDto);

    return this.generateTokenAdmin(newAdmin);
  }

  async signInAdmin(signInDto: SignInDto) {
    const admin = await this.adminService.findAdminByEmail(signInDto.email);
    if (!admin) {
      throw new UnauthorizedException("Admin not found");
    }

    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      admin.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedException("Password or email are invalid");
    }
    return this.generateTokenAdmin(admin);
  }
}
