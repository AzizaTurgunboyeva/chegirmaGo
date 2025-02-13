import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator";

export class CreateStoreSubscribeDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: number;
  @ApiProperty()
  @IsNotEmpty()
  storeId: number;
}
