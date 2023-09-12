import { ApiProperty } from "@nestjs/swagger"

export class offerDto{
    @ApiProperty()
    offerId: string
    @ApiProperty()
    storeId: string
    @ApiProperty()
    date: string
    @ApiProperty()
    time: string
    @ApiProperty()
    storeOffer: {}
    @ApiProperty()
    createdAt: string
}