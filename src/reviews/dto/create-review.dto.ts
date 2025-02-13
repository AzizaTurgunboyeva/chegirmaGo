import { ApiProperty } from "@nestjs/swagger";

export class CreateReviewDto {
    @ApiProperty()
    discountId:number
    @ApiProperty()
    userId:number
    @ApiProperty()
    text:string
    @ApiProperty()
    rating:number
    @ApiProperty()
    photo:string


}
