import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from 'uuid';
@Schema({ timestamps: true })
export class Ads extends Document{
    @Prop({default: uuid})
    adsId: string
    @Prop()
    storeId: string
    @Prop()
    offers: []
    @Prop()
    priority: number
    @Prop()
    banner: []
    @Prop()
    storeName: string
    @Prop()
    storeImage:string
}

export const adsSchema = SchemaFactory.createForClass(Ads);