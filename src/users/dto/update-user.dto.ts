import { IsEmail, IsOptional, IsPhoneNumber, IsString } from "class-validator";

//passwordga alohida dto

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @IsPhoneNumber("UZ")
  phone?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
}
