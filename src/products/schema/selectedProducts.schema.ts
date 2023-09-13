import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { SelcectedProductStatus } from "src/auth/guards/roles.enum";
import { v4 as uuid } from 'uuid';
@Schema({ timestamps: true })
export class SelectedProducts extends Document{
    @Prop({default: uuid})
    selectedProductId: string
    @Prop()
    selectedProduct: string
    @Prop()
    userId: string
    @Prop()
    storeId: string
    @Prop({default: SelcectedProductStatus.REQUESTED})
    requestStatus: string
    @Prop()
    date: string
    @Prop()
    time: string
}

export const selectedProductSchema = SchemaFactory.createForClass(SelectedProducts);