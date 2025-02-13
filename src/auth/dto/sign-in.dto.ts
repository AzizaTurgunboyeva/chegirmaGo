import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
  @IsEmail()
  @ApiProperty()
  readonly email: string;
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
