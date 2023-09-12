import { ApiProperty } from "@nestjs/swagger";

export class categoryDto{
    @ApiProperty()
    categoryId: string
    @ApiProperty()
    categoryName: string
}