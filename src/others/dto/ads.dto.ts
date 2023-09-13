import { ApiProperty } from "@nestjs/swagger";

export class adsDto{
    @ApiProperty()
    adsId: string
    @ApiProperty()
    storeId: string
    @ApiProperty()
    offers: []
    @ApiProperty()
    priority: number
    @ApiProperty()
    banner: []
    @ApiProperty()
    storeName: string
    @ApiProperty()
    storeImage: string
}