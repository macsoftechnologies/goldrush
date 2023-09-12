import { Body, Controller, Get, HttpStatus, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { productDto } from './dto/products.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { categoryDto } from './dto/category.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/addcategory')
  async addcategory(@Body() req: categoryDto) {
    try{
      const addcategory = await this.productsService.addCategory(req);
      return addcategory
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Get('/getcategorylist')
  async getcategorylist() {
    try{
      const addcategory = await this.productsService.getCategoryList();
      return addcategory
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getcategorybyid')
  async getcategorybyid(@Body() req: categoryDto) {
    try{
      const getcategory = await this.productsService.getCategoryById(req);
      return getcategory
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/updatecategory')
  async updatecategory(@Body() req: categoryDto) {
    try{
      const moderate = await this.productsService.updateCategory(req);
      return moderate
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/deletecategory')
  async deletecategory(@Body() req: categoryDto) {
    try{
      const eliminate = await this.productsService.deleteCategory(req);
      return eliminate
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.STORE)
  @Post('/addproduct')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async addProduct(@Body() req: productDto, @UploadedFiles() image) {
    try{
      const addproduct = await this.productsService.addProduct(req, image);
      return addproduct
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Get('/getproduct')
  async getProductList() {
    try{
      const getlist = await this.productsService.getProductList();
      return getlist
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getproductbyid')
  async getProductById(@Body() req: productDto) {
    try{
      const getproduct = await this.productsService.getProductById(req);
      return getproduct
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getproductbygoldtype')
  async getProductByGoldType(@Body() req: productDto) {
    try{
      const getproduct = await this.productsService.getProductsByGoLdType(req);
      return getproduct
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.STORE)
  @Post('/updateproduct')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './files',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProduct(@Body() req: productDto, @UploadedFiles() image) {
    try{
      const moderate = await this.productsService.updateProduct(req, image);
      return moderate
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.STORE)
  @Post('/deleteproductimage')
  async deleteProductImage(@Body() req: productDto) {
    try {
      const removeImage = await this.productsService.deleteproductImage(
        req,
      );
      return removeImage;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: error,
      };
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN,Role.STORE)
  @Post('/deleteproduct')
  async deleteProduct(@Body() req: productDto) {
    try{
      const eliminate = await this.productsService.deleteProduct(req);
      return eliminate
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }
}
