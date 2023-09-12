import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ProductStatus, Role } from "src/auth/guards/roles.enum";
import { v4 as uuid } from 'uuid';
@Schema()
export class productSpecifications{}

@Schema({ timestamps: true })
export class Product extends Document{
    @Prop({ default: uuid })
    productId: string
    @Prop()
    productName: string
    @Prop()
    productImage: []
    @Prop({trim: true,strict:true,type:productSpecifications})
    productSpecifications: {
        type: any
    }
    @Prop()
    offers: []
    @Prop()
    categoryId: string
    @Prop({default: ProductStatus.AVAILABLE})
    status: string
    @Prop()
    priority: string
    @Prop()
    storeId: string
    @Prop()
    goldType: string
}

export const productSchema = SchemaFactory.createForClass(Product);