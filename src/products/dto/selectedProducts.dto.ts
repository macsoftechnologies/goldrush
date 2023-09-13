import { ApiProperty } from "@nestjs/swagger"

export class selectedProductsDto{
    @ApiProperty()
    selectedProductId: string
    @ApiProperty()
    selectedProduct: string
    @ApiProperty()
    userId: string
    @ApiProperty()
    storeId: string
    @ApiProperty()
    requestStatus: string
    @ApiProperty()
    date: string
    @ApiProperty()
    time: string
    @ApiProperty()
    createdAt: string
}