import { ApiProperty } from "@nestjs/swagger"

export class productDto{
    @ApiProperty()
    productId: string
    @ApiProperty()
    productName: string
    @ApiProperty()
    productImage: []
    @ApiProperty()
    productSpecifications: {}
    @ApiProperty()
    offers: []
    @ApiProperty()
    categoryId: string
    @ApiProperty()
    status: string
    @ApiProperty()
    priority: string
    @ApiProperty()
    storeId: string
    @ApiProperty()
    goldType: string
}