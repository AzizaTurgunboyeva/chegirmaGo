import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator"

export class CreateStoreDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  @IsPhoneNumber("UZ")
  phone: string;
  @ApiProperty()
  ownerId: number;
  @ApiProperty()
  storeSocialLinkId: number;
  @ApiProperty()
  districtId: number;
}
