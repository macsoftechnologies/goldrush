import { ApiProperty } from "@nestjs/swagger"

export class userDto{
    @ApiProperty()
    userId: string
    @ApiProperty()
    userName: string
    @ApiProperty()
    mobileNumber: number
    @ApiProperty()
    password: string
    @ApiProperty()
    address: []
    @ApiProperty()
    referralCode: string
    @ApiProperty()
    role: string
}