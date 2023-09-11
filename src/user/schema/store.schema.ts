import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/auth/guards/roles.enum";
import { v4 as uuid } from 'uuid';

class StoreLocation {
    @Prop()
    longitude: string;

    @Prop()
    latitude: string;
}

@Schema({ timestamps: true })

export class Store extends Document{
    @Prop({default: uuid})
    storeId: string
    @Prop()
    storeName: string
    @Prop()
    mobileNumber: number
    @Prop()
    password: string
    @Prop()
    storeImage: string
    @Prop({ type: StoreLocation })
    storeLocation: StoreLocation;
    @Prop({default: Role.STORE})
    role: string
}

export const storeSchema = SchemaFactory.createForClass(Store);