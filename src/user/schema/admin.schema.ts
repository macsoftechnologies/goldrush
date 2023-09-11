import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
@Schema({ timestamps: true })

export class Admin extends Document{
    @Prop()
    mobileNumber: number
    @Prop()
    email: string
    @Prop()
    password: string
}

export const adminSchema = SchemaFactory.createForClass(Admin);