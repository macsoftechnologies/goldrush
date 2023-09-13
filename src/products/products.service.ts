import { HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './schema/products.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { productDto } from './dto/products.dto';
import { categoryDto } from './dto/category.dto';
import { SelectedProducts } from './schema/selectedProducts.schema';
import { selectedProductsDto } from './dto/selectedProducts.dto';

var moment = require('moment');

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(SelectedProducts.name)
    private readonly selectedProductModel: Model<SelectedProducts>,
  ) {}

  async addCategory(req: categoryDto) {
    try {
      const add = await this.categoryModel.create(req);
      if (add) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Category added successfully',
          categoryDetails: add,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getCategoryList() {
    try {
      const getList = await this.categoryModel.find();
      if (getList) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of Categories',
          categoryList: getList,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getCategoryById(req: categoryDto) {
    try {
      const getCategory = await this.categoryModel.findOne({
        categoryId: req.categoryId,
      });
      if (getCategory) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Details of Category',
          categoryList: getCategory,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async updateCategory(req: categoryDto) {
    try {
      const findCategory = await this.categoryModel.findOne({
        categoryId: req.categoryId,
      });
      if (findCategory) {
        const moderate = await this.categoryModel.updateOne(
          { categoryId: req.categoryId },
          {
            $set: { categoryName: req.categoryName },
          },
        );
        if (moderate) {
          return {
            statusCode: HttpStatus.OK,
            message: 'updated Successfully',
            categoryList: moderate,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid Request',
          };
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Category not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteCategory(req: categoryDto) {
    try {
      const findCategory = await this.categoryModel.findOne({
        categoryId: req.categoryId,
      });
      if (findCategory) {
        const removecatgeory = await this.categoryModel.deleteOne({
          categoryId: req.categoryId,
        });
        if (removecatgeory) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Deleted Successfully',
            deleteStatus: removecatgeory,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invlaid Request',
          };
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async addProduct(req: productDto, image) {
    try {
      if (image) {
        const reqDoc = image.map((doc, index) => {
          let IsPrimary = false;
          if (index == 0) {
            IsPrimary = true;
          }
          const randomNumber = Math.floor(Math.random() * 1000000 + 1);
          return doc.filename;
        });

        req.productImage = reqDoc;
      }
      const addProduct = await this.productModel.create(req);
      if (addProduct) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Product Added Successfully',
          productDetails: addProduct,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getProductList() {
    try {
      const getList = await this.productModel.find();
      if (getList) {
        const list = await this.productModel.aggregate([
          {
            $lookup: {
              from: 'stores',
              localField: 'storeId',
              foreignField: 'storeId',
              as: 'storeId',
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: 'categoryId',
              as: 'categoryId',
            },
          },
        ]);
        return {
          statusCode: HttpStatus.OK,
          message: 'List of Products',
          productsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getProductById(req: productDto) {
    try {
      const findProduct = await this.productModel.findOne({
        productId: req.productId,
      });
      if (findProduct) {
        const product = await this.productModel.aggregate([
          { $match: { productId: findProduct.productId } },
          {
            $lookup: {
              from: 'stores',
              localField: 'storeId',
              foreignField: 'storeId',
              as: 'storeId',
            },
          },
          {
            $lookup: {
              from: 'categories',
              localField: 'categoryId',
              foreignField: 'categoryId',
              as: 'categoryId',
            },
          },
        ]);
        return {
          statusCode: HttpStatus.OK,
          message: 'Details of the product',
          productDetails: product,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getProductsByGoLdType(req: productDto) {
    try {
      const regexPattern = new RegExp(req.goldType, 'i');
      const list = await this.productModel.aggregate([
        { $match: { goldType: { $regex: regexPattern } } },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: 'categoryId',
            as: 'categoryId',
          },
        },
        {
          $lookup: {
            from: 'stores',
            localField: 'storeId',
            foreignField: 'storeId',
            as: 'storeId',
          },
        },
      ]);
      if (list.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of Products based on goldtype',
          productsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No Products With this GoldType',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async updateProduct(req, image) {
    try {
      const findProduct = await this.productModel.findOne({
        productId: req.productId,
      });

      if (findProduct) {
        const existingImages = findProduct.productImage || []; // Get existing images

        const updateData: any = {
          productName: req.productName,
          productSpecifications: req.productSpecifications,
          offers: req.offers,
          categoryId: req.categoryId,
          status: req.status,
          priority: req.priority,
          storeId: req.storeId,
          goldType: req.goldType,
        };

        if (image) {
          const reqDoc = image.map((doc, index) => {
            let IsPrimary = false;
            if (index == 0) {
              IsPrimary = true;
            }
            const randomNumber = Math.floor(Math.random() * 1000000 + 1);
            return doc.filename;
          });

          updateData.productImage = existingImages.concat(reqDoc);
        } else {
          updateData.productImage = existingImages;
        }

        const moderate = await this.productModel.updateOne(
          { productId: req.productId },
          {
            $set: updateData,
          },
        );

        if (moderate) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Updated Successfully',
            updatedStatus: moderate,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid Request',
          };
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Product Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteproductImage(req: productDto) {
    try {
      const removeProductImage = await this.productModel.updateOne(
        { productId: req.productId },
        { $pull: { productImage: req.productImage } },
      );
      return {
        statusCode: HttpStatus.OK,
        removeImg: removeProductImage,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        msg: error,
      };
    }
  }

  async deleteProduct(req: productDto) {
    try {
      const removeProduct = await this.productModel.deleteOne({
        productId: req.productId,
      });
      if (removeProduct) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Deleted Successfully',
          deletedStatus: removeProduct,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async addSelectedProduct(req: selectedProductsDto) {
    try {
      const findProduct = await this.selectedProductModel.findOne({
        $and: [
          { selectedProduct: req.selectedProduct },
          { userId: req.userId },
        ],
      });
      if (!findProduct) {
        req.date = moment(req.createdAt).format('DD-MM-YYYY');
        req.time = moment(req.createdAt).format('hh:mm:ss');
        const addSelectProduct = await this.selectedProductModel.create(req);
        if (addSelectProduct) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Product Selected Successfully',
            selectedProductDetails: addSelectProduct,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid Request',
          };
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Product Already selected',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getselectedproducts() {
    try {
      const list = await this.selectedProductModel.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: 'selectedProduct',
            foreignField: 'productId',
            as: 'selectedProduct',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'userId',
            as: 'userId',
          },
        },
        {
          $lookup: {
            from: 'stores',
            localField: 'storeId',
            foreignField: 'storeId',
            as: 'storeId',
          },
        },
      ]);
      if (list.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of selected Products',
          selctedProductsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getselectedproductsbyid(req: selectedProductsDto) {
    try {
      const list = await this.selectedProductModel.aggregate([
        { $match: { selectedProductId: req.selectedProductId } },
        {
          $lookup: {
            from: 'products',
            localField: 'selectedProduct',
            foreignField: 'productId',
            as: 'selectedProduct',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'userId',
            as: 'userId',
          },
        },
        {
          $lookup: {
            from: 'stores',
            localField: 'storeId',
            foreignField: 'storeId',
            as: 'storeId',
          },
        },
      ]);
      if (list.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of selected Product',
          selctedProductsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getselectedproductsofuser(req: selectedProductsDto) {
    try {
      const list = await this.selectedProductModel.aggregate([
        { $match: { userId: req.userId } },
        {
          $lookup: {
            from: 'products',
            localField: 'selectedProduct',
            foreignField: 'productId',
            as: 'selectedProduct',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'userId',
            as: 'userId',
          },
        },
        {
          $lookup: {
            from: 'stores',
            localField: 'storeId',
            foreignField: 'storeId',
            as: 'storeId',
          },
        },
      ]);
      if (list.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of selected Products of User',
          selctedProductsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getselectedproductsofstore(req: selectedProductsDto) {
    try {
      const list = await this.selectedProductModel.aggregate([
        { $match: { storeId: req.storeId } },
        {
          $lookup: {
            from: 'products',
            localField: 'selectedProduct',
            foreignField: 'productId',
            as: 'selectedProduct',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'userId',
            as: 'userId',
          },
        },
        {
          $lookup: {
            from: 'stores',
            localField: 'storeId',
            foreignField: 'storeId',
            as: 'storeId',
          },
        },
      ]);
      if (list.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of selected Products of Store',
          selctedProductsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async updateSelectedProduct(req: selectedProductsDto) {
    try {
      const findProduct = await this.selectedProductModel.findOne({
        selectedProductId: req.selectedProductId,
      });
      if (findProduct) {
        const moderate = await this.selectedProductModel.updateOne(
          { selectedProductId: req.selectedProductId },
          {
            $set: { requestStatus: req.requestStatus },
          },
        );
        if (moderate) {
          return {
            statusCode: HttpStatus.OK,
            message:
              'Selected Product Status has Chnaged to ${req.requestStatus}',
            updatedStatus: moderate,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Request Status has Not Changed',
          };
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteSelectedProduct(req: selectedProductsDto){
    try{
        const findProduct = await this.selectedProductModel.findOne({selectedProductId: req.selectedProductId});
        if(findProduct) {
            const eliminate = await this.selectedProductModel.deleteOne({selectedProductId: req.selectedProductId});
            if(eliminate) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Selected Product Deleted",
                    deleteStatus: eliminate,
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Invalid Request",
                }
            }
        } else {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Selected Product Not Found",
            }
        }
    } catch(error) {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error,
        }
    }
  }
}
