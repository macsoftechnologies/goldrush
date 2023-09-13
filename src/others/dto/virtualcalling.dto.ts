import { ApiProperty } from "@nestjs/swagger";

export class virtualCallingScheduleDto{
    @ApiProperty()
    callId: string
    @ApiProperty()
    storeId: string
    @ApiProperty()
    userId: string
    @ApiProperty()
    date: string
    @ApiProperty()
    time_from: string
    @ApiProperty()
    time_to: string
    @ApiProperty()
    userName: string
    @ApiProperty()
    mobileNumber: number
}