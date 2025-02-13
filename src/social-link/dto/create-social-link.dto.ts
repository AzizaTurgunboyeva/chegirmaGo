import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator"

export class CreateSocialLinkDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  icon: string;
}


