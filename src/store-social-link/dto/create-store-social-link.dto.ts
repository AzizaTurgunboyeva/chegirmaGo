import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateStoreSocialLinkDto {
  @ApiProperty()
  @IsNotEmpty()
  url: string;
  @ApiProperty()
  description: string;
  socialLinkId:number
}
