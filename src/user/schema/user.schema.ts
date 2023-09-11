import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/auth/guards/roles.enum";
import { v4 as uuid } from 'uuid';
@Schema({ timestamps: true })

export class User extends Document{
    @Prop({default: uuid})
    userId: string
    @Prop()
    userName: string
    @Prop()
    mobileNumber: number
    @Prop()
    password: string
    @Prop()
    address: []
    @Prop()
    referralCode: string
    @Prop({default: Role.USER})
    role: string
}

export const userSchema = SchemaFactory.createForClass(User);