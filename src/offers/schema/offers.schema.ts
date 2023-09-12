import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuid } from 'uuid';
@Schema()
export class storeOffers{}

@Schema({ timestamps: true })
export class Offers extends Document{
    @Prop({default: uuid})
    offerId: string
    @Prop()
    storeId: string
    @Prop()
    date: string
    @Prop()
    time: string
    @Prop({trim: true,strict:true,type:storeOffers})
    storeOffer: {
        type: any
    }
}

export const offerSchema = SchemaFactory.createForClass(Offers);