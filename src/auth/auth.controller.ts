import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { CreateAdminDto } from "../admin/dto/create-admin.dto";
import { CookiGetter } from "../decorator/cookie_getter.decorator";


@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Yangi foydalanuvchi ro'yhatdan o'tkazish" })
  @ApiResponse({
    status: 201,
    description: "Ro'yhatdan o'tgan foydalanuvchi",
    type: String,
  })
  @Post("signup")
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @ApiOperation({ summary: "Tizimga kirish" })
  @Post("signin")
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response //bog'lash
  ) {
    return this.authService.signIn(signInDto, res);
  }


  @ApiOperation({ summary: "Tizimdan chiqish" })
  @Post("signout")
  async signOut(
    @CookiGetter("refresh_token") refreshToken:string,
    @Res({passthrough:true}) res:Response
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  @HttpCode(200)
  @Post(":id/refresh")
  refresh(
    @Param("id", ParseIntPipe) id:number,
    @CookiGetter("refresh_token") refreshToken:string,
    @Res({passthrough:true}) res:Response
  ){
    return this.authService.refreshToken(id,refreshToken,res)
  }



  //---------------------------------------------------
  @ApiOperation({ summary: "Admin ro'yxatdan o'tkazish" })
  @ApiResponse({
    status: 201,
    description: "Ro'yxatdan o'tgan admin",
    type: String,
  })
  @Post("signup_admin")
  async signUpCustomer(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.signUpAdmin(createAdminDto);
  }

  @ApiOperation({ summary: "Tizimga kirish" })
  @HttpCode(HttpStatus.OK)
  @Post("signin_admin")
  async signInCustomer(@Body() signInDto: SignInDto) {
    return this.authService.signInAdmin(signInDto);
  }
}
