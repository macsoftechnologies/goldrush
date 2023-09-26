import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { Admin } from './schema/admin.schema';
import { adminDto } from './dto/admin.dto';
import { storeDto } from './dto/store.dto';
import { Store } from './schema/store.schema';
import { userDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly authService: AuthService,
  ) {}

  async createAdmin(req: adminDto) {
    try {
      const findAdmin = await this.adminModel.findOne({
        $or: [{ mobileNumber: req.mobileNumber }, { email: req.email }],
      });
      if (!findAdmin) {
        const bcryptPassword = await this.authService.hashPassword(
          req.password,
        );
        req.password = bcryptPassword;
        const addAdmin = await this.adminModel.create(req);
        return {
          statusCode: HttpStatus.OK,
          message: "Admin added Successfully",
          details: addAdmin,
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Admin already existed',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async loginAdmin(req: adminDto) {
    try {
      const findAdmin = await this.adminModel.findOne({
        $or: [{ mobileNumber: req.mobileNumber }, { email: req.email }],
      });
      //   console.log(findUser);
      if (!findAdmin) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Admin Not Found',
        };
      } else {
        const matchPassword = await this.authService.comparePassword(
          req.password,
          findAdmin.password,
        );
        // console.log(matchPassword);
        if (matchPassword) {
          const jwtToken = await this.authService.createToken({ findAdmin });
          //   console.log(jwtToken);
          return {
            statusCode: HttpStatus.OK,
            message: "Admin Login successfull",
            token: jwtToken,
            details: findAdmin,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Password incorrect',
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

  async createUser(req: userDto) {
    try {
      const findUser = await this.userModel.findOne({
        mobileNumber: req.mobileNumber,
      });
      if (!findUser) {
        const bcryptPassword = await this.authService.hashPassword(
          req.password,
        );
        req.password = bcryptPassword;
        const addUser = await this.userModel.create(req);
        return {
          statusCode: HttpStatus.OK,
          message: "User added successfully",
          details: addUser,
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User already existed',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async loginUser(req: userDto) {
    try {
      const findUser = await this.userModel.findOne({
        mobileNumber: req.mobileNumber,
      });
      //   console.log(findUser);
      if (!findUser) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User Not Found',
        };
      } else {
        const matchPassword = await this.authService.comparePassword(
          req.password,
          findUser.password,
        );
        // console.log(matchPassword);
        if (matchPassword) {
          const jwtToken = await this.authService.createToken({ findUser });
          //   console.log(jwtToken);
          return {
            statusCode: HttpStatus.OK,
            message: "User Login successfull",
            token: jwtToken,
            details: findUser,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Password incorrect',
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

  async getUsersList() {
    try {
      const list = await this.userModel.find();
      if (list) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of users',
          details: list,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          messsage: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getUserById(req: userDto) {
    try {
      const findUser = await this.userModel.findOne({ userId: req.userId });
      if (findUser) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User Details',
          details: findUser,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Unable to find User',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async updateUser(req: userDto) {
    try {
      const findUser = await this.userModel.findOne({ userId: req.userId });
      if (findUser) {
        if (req.password) {
          const bcryptPassword = await this.authService.hashPassword(
            req.password,
          );
          const moderate = await this.userModel.updateOne(
            { userId: req.userId },
            {
              $set: {
                userName: req.userName,
                mobileNumber: req.mobileNumber,
                address: req.address,
                password: bcryptPassword,
                referralCode: req.referralCode,
              },
            },
          );
          if (moderate) {
            return {
              statusCode: HttpStatus.OK,
              message: 'Updated Successfully',
              details: moderate,
            };
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid Request',
            };
          }
        } else {
          const moderate = await this.userModel.updateOne(
            { userId: req.userId },
            {
              $set: {
                userName: req.userName,
                mobileNumber: req.mobileNumber,
                address: req.address,
                referralCode: req.referralCode,
              },
            },
          );
          if (moderate) {
            return {
              statusCode: HttpStatus.OK,
              message: 'Updated Successfully',
              details: moderate,
            };
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid Request',
            };
          }
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteUser(req: userDto) {
    try {
      const findUser = await this.userModel.findOne({ userId: req.userId });
      if (findUser) {
        const eliminate = await this.userModel.deleteOne({
          userId: req.userId,
        });
        if (eliminate) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Deleted Successfully',
            details: eliminate,
            deletedUser: findUser,
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
          message: 'User Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async createStore(req: storeDto, image) {
    try {
      const findStore = await this.storeModel.findOne({
        mobileNumber: req.mobileNumber,
      });
      if (!findStore) {
        if (image) {
          const reqDoc = image.map((doc, index) => {
            let IsPrimary = false;
            if (index == 0) {
              IsPrimary = true;
            }
            const randomNumber = Math.floor(Math.random() * 1000000 + 1);
            return doc.filename;
          });

          req.storeImage = reqDoc.toString();
        }
        const bcryptPassword = await this.authService.hashPassword(
          req.password,
        );
        req.password = bcryptPassword;
        const addStore = await this.storeModel.create(req);
        return {
          statusCode: HttpStatus.OK,
          message: "Store Created Successfully",
          details: addStore,
        }
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Store is already existed',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async loginStore(req: storeDto) {
    try {
      const findStore = await this.storeModel.findOne({
        mobileNumber: req.mobileNumber,
      });
      //   console.log(findUser);
      if (!findStore) {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Store Not Found',
        };
      } else {
        const matchPassword = await this.authService.comparePassword(
          req.password,
          findStore.password,
        );
        // console.log(matchPassword);
        if (matchPassword) {
          const jwtToken = await this.authService.createToken({ findStore });
          //   console.log(jwtToken);
          return {
            statusCode: HttpStatus.OK,
            message: "Store Login successfull",
            token: jwtToken,
            details: findStore,
          };
        } else {
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Password incorrect',
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

  async getStoresList() {
    try {
      const list = await this.storeModel.find();
      if (list) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of Stores',
          details: list,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          messsage: 'Invalid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getStoreById(req: storeDto) {
    try {
      const findStore = await this.storeModel.findOne({ storeId: req.storeId });
      if (findStore) {
        return {
          statusCode: HttpStatus.OK,
          message: 'User Details',
          details: findStore,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Unable to find Store',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async updateStore(req: storeDto, image) {
    try {
      const findStore = await this.storeModel.findOne({ storeId: req.storeId });
      if (findStore) {
        // console.log(findStore);
        if (image) {
          const reqDoc = image.map((doc, index) => {
            let IsPrimary = false;
            if (index == 0) {
              IsPrimary = true;
            }
            const randomNumber = Math.floor(Math.random() * 1000000 + 1);
            return doc.filename;
          });

          req.storeImage = reqDoc.toString();
        }
        if (req.password) {
          const bcryptPassword = await this.authService.hashPassword(
            req.password,
          );
          if (req.storeImage) {
            const moderate = await this.storeModel.updateOne(
              { storeId: req.storeId },
              {
                $set: {
                  storeName: req.storeName,
                  mobileNumber: req.mobileNumber,
                  // storeLocation: {
                  //   longitude: req.storeLocation.longitude,
                  //   latitude: req.storeLocation.latitude,
                  // },
                  password: bcryptPassword,
                  storeImage: req.storeImage,
                },
              },
            );
            if (moderate) {
              return {
                statusCode: HttpStatus.OK,
                message: 'Updated Successfully',
                details: moderate,
              };
            } else {
              return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid Request',
              };
            }
          } else {
            const moderate = await this.storeModel.updateOne(
              { storeId: req.storeId },
              {
                $set: {
                  storeName: req.storeName,
                  mobileNumber: req.mobileNumber,
                  storeLocation: req.storeLocation,
                  password: bcryptPassword,
                },
              },
            );
            if (moderate) {
              return {
                statusCode: HttpStatus.OK,
                message: 'Updated Successfully',
                details: moderate,
              };
            } else {
              return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid Request',
              };
            }
          }
        } else {
          if (req.storeImage) {
            const moderate = await this.storeModel.updateOne(
              { storeId: req.storeId },
              {
                $set: {
                  storeName: req.storeName,
                  mobileNumber: req.mobileNumber,
                  storeLocation: req.storeLocation,
                  storeImage: req.storeImage,
                },
              },
            );
            if (moderate) {
              return {
                statusCode: HttpStatus.OK,
                message: 'Updated Successfully',
                details: moderate,
              };
            } else {
              return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid Request',
              };
            }
          } else {
            const moderate = await this.storeModel.updateOne(
              { storeId: req.storeId },
              {
                $set: {
                  storeName: req.storeName,
                  mobileNumber: req.mobileNumber,
                  storeLocation: req.storeLocation,
                },
              },
            );
            if (moderate) {
              return {
                statusCode: HttpStatus.OK,
                message: 'Updated Successfully',
                details: moderate,
              };
            } else {
              return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'Invalid Request',
              };
            }
          }
        }
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Store not found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteStore(req: storeDto) {
    try {
      const findStore = await this.storeModel.findOne({ storeId: req.storeId });
      if (findStore) {
        const eliminate = await this.storeModel.deleteOne({
          storeId: req.storeId,
        });
        if (eliminate) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Deleted Successfully',
            details: eliminate,
            deletedUser: findStore,
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
          message: 'Store Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async storeUpdate(req: storeDto, image) {
    try {
      const findStore = await this.storeModel.findOne({ storeId: req.storeId });
      console.log(req, 'req...', image);
      if (image) {
        const reqDoc = image.map((doc, index) => {
          let IsPrimary = false;
          if (index == 0) {
            IsPrimary = true;
          }
          const randomNumber = Math.floor(Math.random() * 1000000 + 1);
          return doc.filename;
        });

        req.storeImage = reqDoc.toString();
      }
      //console.log(req.storeId, 'storeId...................');
      //console.log(req.storeLocation, 'longitude.........................');
      if(req.password) {
        const bcryptPassword = await this.authService.hashPassword(
          req.password,
        );
        if(req.storeImage) {
          const updatestoreResp = await this.storeModel.updateOne(
            { storeId: req.storeId },
            {
              $set: {
                storeName: req.storeName,
                mobileNumber: req.mobileNumber,
                storeLocation: JSON.parse(req.storeLocation),
                storeImage: req.storeImage,
                password: bcryptPassword,
              },
            },
          );
          console.log(updatestoreResp);
          const count = await this.storeModel.count();
    
          if (updatestoreResp) {
            return {
              statusCode: HttpStatus.OK,
              count: count,
              details: updatestoreResp,
            };
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid Request',
            }
          }
        } else {
          const updatestoreResp = await this.storeModel.updateOne(
            { storeId: req.storeId },
            {
              $set: {
                storeName: req.storeName,
                mobileNumber: req.mobileNumber,
                storeLocation: JSON.parse(req.storeLocation),
                password: bcryptPassword,
              },
            },
          );
          console.log(updatestoreResp);
          const count = await this.storeModel.count();
    
          if (updatestoreResp) {
            return {
              statusCode: HttpStatus.OK,
              count: count,
              details: updatestoreResp,
            };
          }
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid Request',
          };
        }
      } else {
        if(req.storeImage) {
          const updatestoreResp = await this.storeModel.updateOne(
            { storeId: req.storeId },
            {
              $set: {
                storeName: req.storeName,
                mobileNumber: req.mobileNumber,
                storeLocation: JSON.parse(req.storeLocation),
                storeImage: req.storeImage,
              },
            },
          );
          console.log(updatestoreResp);
          const count = await this.storeModel.count();
    
          if (updatestoreResp) {
            return {
              statusCode: HttpStatus.OK,
              count: count,
              details: updatestoreResp,
            };
          } else {
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Invalid Request',
            }
          }
        } else {
          const updatestoreResp = await this.storeModel.updateOne(
            { storeId: req.storeId },
            {
              $set: {
                storeName: req.storeName,
                mobileNumber: req.mobileNumber,
                storeLocation: JSON.parse(req.storeLocation),
              },
            },
          );
          console.log(updatestoreResp);
          const count = await this.storeModel.count();
    
          if (updatestoreResp) {
            return {
              statusCode: HttpStatus.OK,
              count: count,
              details: updatestoreResp,
            };
          }
          return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Invalid Request',
          };
        }
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
