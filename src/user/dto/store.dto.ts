import { ApiProperty } from "@nestjs/swagger"

class StoreLocationDto {
    longitude: string;
    latitude: string;
  }
export class storeDto{
    @ApiProperty()
    storeId: string
    @ApiProperty()
    storeName: string
    @ApiProperty()
    mobileNumber: number
    @ApiProperty()
    password: string
    @ApiProperty()
    storeImage: string
    @ApiProperty()
    storeLocation: StoreLocationDto;
    @ApiProperty()
    role: string
}