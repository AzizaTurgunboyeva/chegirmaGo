import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from "class-validator";



export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  @IsPhoneNumber("UZ")
  phone: string;
  @IsEmail()
  @ApiProperty()
  email: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirm_password: string;
}
