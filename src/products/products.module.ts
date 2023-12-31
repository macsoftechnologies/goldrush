import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from './schema/products.schema';
import { Category, categorySchema } from './schema/category.schema';
import { SelectedProducts, selectedProductSchema } from './schema/selectedProducts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: productSchema },
      { name: Category.name, schema: categorySchema },
      { name: SelectedProducts.name, schema: selectedProductSchema },      
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
