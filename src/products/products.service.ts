import { HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './schema/products.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { productDto } from './dto/products.dto';
import { categoryDto } from './dto/category.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

    async addCategory(req: categoryDto) {
        try{
            const add = await this.categoryModel.create(req);
            if(add) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Category added successfully",
                    categoryDetails: add,
                }
            } else {
                return{
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Invalid Request",
                }
            }
        } catch(error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

    async getCategoryList() {
        try{
            const getList = await this.categoryModel.find();
            if(getList) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "List of Categories",
                    categoryList: getList,
                }
            } else{
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Invalid Request",
                }
            }
        } catch(error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

    async getCategoryById(req: categoryDto) {
        try{
            const getCategory = await this.categoryModel.findOne({categoryId: req.categoryId});
            if(getCategory) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Details of Category",
                    categoryList: getCategory,
                }
            } else{
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Invalid Request",
                }
            }
        } catch(error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

    async updateCategory(req: categoryDto) {
        try{
            const findCategory = await this.categoryModel.findOne({categoryId: req.categoryId});
            if(findCategory) {
                const moderate = await this.categoryModel.updateOne({categoryId: req.categoryId},{
                    $set: {categoryName: req.categoryName}
                })
                if(moderate) {
                    return {
                        statusCode: HttpStatus.OK,
                        message: "updated Successfully",
                        categoryList: moderate,
                    }
                } else {
                    return {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "Invalid Request",
                    }
                }
            } else{
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Category not found",
                }
            }
        } catch(error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

    async deleteCategory(req: categoryDto) {
        try{
            const findCategory = await this.categoryModel.findOne({categoryId: req.categoryId});
            if(findCategory) {
                const removecatgeory = await this.categoryModel.deleteOne({categoryId: req.categoryId});
                if(removecatgeory) {
                    return {
                        statusCode: HttpStatus.OK,
                        message: "Deleted Successfully",
                        deleteStatus: removecatgeory,
                    }
                } else  {
                    return {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "Invlaid Request",
                    }
                }
            } else{
                return  {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Product not found",
                }
            }
        } catch(error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

  async addProduct(req: productDto, image) {
    try{
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
        if(addProduct) {
            return {
                statusCode: HttpStatus.OK,
                message: "Product Added Successfully",
                productDetails: addProduct,
            }
        } else {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid Request"
            }
        }
    } catch(error) {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error,
        }
    }
  }

  async getProductList() {
    try{
        const getList = await this.productModel.find();
        if(getList) {
            const list = await this.productModel.aggregate([
                {
                    $lookup: {
                        from: "stores",
                        localField: "storeId",
                        foreignField: "storeId",
                        as: "storeId",
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "categoryId",
                        as: "categoryId",
                    }
                }
            ]);
            return {
                statusCode: HttpStatus.OK,
                message: "List of Products",
                productsList: list,
                
            }
        }  else {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid Request",
            }
        }
    } catch(error) {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error,
        }
    }
  }

  async getProductById(req: productDto) {
    try{
        const findProduct = await this.productModel.findOne({productId: req.productId});
        if(findProduct) {
            const product = await this.productModel.aggregate([
                {$match: {productId: findProduct.productId}},
                {
                    $lookup: {
                        from: "stores",
                        localField: "storeId",
                        foreignField: "storeId",
                        as: "storeId",
                    }
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "categoryId",
                        foreignField: "categoryId",
                        as: "categoryId",
                    }
                }
            ]);
            return {
                statusCode: HttpStatus.OK,
                message: "Details of the product",
                productDetails: product,
            }
        } else {
            return {
                statusCode: HttpStatus.NOT_FOUND,
                message: "Product Not Found",
            }
        }
    } catch(error) {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error,
        }
    }
  }

async updateProduct(req, image) {
    try {
        const findProduct = await this.productModel.findOne({ productId: req.productId });

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

            const moderate = await this.productModel.updateOne({ productId: req.productId }, {
                $set: updateData
            });

            if (moderate) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Updated Successfully",
                    updatedStatus: moderate,
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
                message: "Product Not Found",
            }
        }
    } catch (error) {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: error,
        }
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
    try{
        const removeProduct = await this.productModel.deleteOne({productId: req.productId});
        if(removeProduct) {
            return {
                statusCode: HttpStatus.OK,
                message:"Deleted Successfully",
                deletedStatus: removeProduct,
            }
        } else {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Invalid Request",
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