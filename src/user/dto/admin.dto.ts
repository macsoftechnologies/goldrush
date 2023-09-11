import { ApiProperty } from "@nestjs/swagger"

export class adminDto{
    @ApiProperty()
    mobileNumber: number
    @ApiProperty()
    email: string
    @ApiProperty()
    password: string
}