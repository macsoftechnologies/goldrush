import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from 'uuid';
@Schema({ timestamps: true })
export class VirtualCalling extends Document{
    @Prop({default: uuid})
    callId: string
    @Prop()
    storeId: string
    @Prop()
    userId: string
    @Prop()
    date: string
    @Prop()
    time_from: string
    @Prop()
    time_to: string
    @Prop()
    userName: string
    @Prop()
    mobileNumber: number
}

export const virtualCallingSchema = SchemaFactory.createForClass(VirtualCalling);