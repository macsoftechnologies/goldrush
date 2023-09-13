import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { VirtualCalling } from './schema/virtualcalling.schema';
import { Model } from 'mongoose';
import { virtualCallingScheduleDto } from './dto/virtualcalling.dto';
import { User } from 'src/user/schema/user.schema';
import { adsDto } from './dto/ads.dto';
import { Ads } from './schema/ads.schema';
import { Store } from 'src/user/schema/store.schema';

@Injectable()
export class OthersService {
  constructor(
    @InjectModel(VirtualCalling.name)
    private readonly virtualCallingModel: Model<VirtualCalling>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Ads.name) private readonly adsModel: Model<Ads>,
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
  ) {}

  async scheduleCall(req: virtualCallingScheduleDto) {
    try {
      const findUser = await this.userModel.findOne({ userId: req.userId });
      req.userName = findUser.userName;
      req.mobileNumber = findUser.mobileNumber;
      const schedule = await this.virtualCallingModel.create(req);
      if (schedule) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Call Has Schedule Successfully',
          scheduledDetails: schedule,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invalid request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getSchedules() {
    try {
      const getlist = await this.virtualCallingModel.aggregate([
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
      if (getlist) {
        return {
          statusCode: HttpStatus.OK,
          message: 'List of call schedules',
          list: getlist,
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

  async getScheduleById(req: virtualCallingScheduleDto) {
    try {
      const getlist = await this.virtualCallingModel.aggregate([
        { $match: { callId: req.callId } },
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
      if (getlist) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Call Details',
          list: getlist,
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

  async getScheduleByUserId(req: virtualCallingScheduleDto) {
    try {
      const getlist = await this.virtualCallingModel.aggregate([
        { $match: { userId: req.userId } },
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
      if (getlist) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Call Details',
          list: getlist,
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

  async getScheduleByStoreId(req: virtualCallingScheduleDto) {
    try {
      const getlist = await this.virtualCallingModel.aggregate([
        { $match: { storeId: req.storeId } },
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
      if (getlist) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Call Details',
          list: getlist,
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

  async updateSchedule(req: virtualCallingScheduleDto) {
    try {
      const moderate = await this.virtualCallingModel.updateOne(
        { callId: req.callId },
        {
          $set: {
            date: req.date,
            time_from: req.time_from,
            time_to: req.time_to,
          },
        },
      );
      if (moderate) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Scheduled Call Updated Successfully',
          updateStatus: moderate,
        };
      } else {
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Invlaid Request',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deleteScheduleCall(req: virtualCallingScheduleDto) {
    try {
      const eliminate = await this.virtualCallingModel.deleteOne({
        callId: req.callId,
      });
      if (eliminate) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Deleted Successfully',
          deleteStatus: eliminate,
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

  async addAd(req: adsDto, image) {
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

        req.banner = reqDoc;
      }
      const findStore = await this.storeModel.findOne({ storeId: req.storeId });
      if (findStore) {
        req.storeName = findStore.storeName;
        req.storeImage = findStore.storeImage;
        const addAD = await this.adsModel.create(req);
        if (addAD) {
          return {
            statusCode: HttpStatus.OK,
            message: 'Product Added Successfully',
            productDetails: addAD,
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

  async getAdsList() {
    try {
      const list = await this.adsModel.aggregate([
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
          message: 'List of Ads',
          adsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: "We Didn't Have Any Ads On this Store",
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getAdById(req: adsDto) {
    try {
      const list = await this.adsModel.aggregate([
        { $match: { adsId: req.adsId } },
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
          message: 'Advertisement Details',
          adsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Advertisement Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async getAdsOfStore(req: adsDto) {
    try {
      const list = await this.adsModel.aggregate([
        { $match: { storeId: req.storeId } },
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
          message: 'Advertisements Of Store',
          adsList: list,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Advertisement Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async updateAd(req: adsDto, image) {
    try {
      const findAd = await this.adsModel.findOne({ adsId: req.adsId });
    if (findAd) {
        const existingImages = findAd.banner || []; 

        const updateData: any = {
            offers: req.offers,
            priority: req.priority,
            banner: req.banner
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

          updateData.banner = existingImages.concat(reqDoc);
        } else {
          updateData.banner = existingImages;
        }

        const moderate = await this.adsModel.updateOne(
          { adsId: req.adsId },
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
          message: 'Advertisement Not Found',
        };
      }
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  async deletebanner(req: adsDto) {
    try {
      const removeProductImage = await this.adsModel.updateOne(
        { adsId: req.adsId },
        { $pull: { banner: req.banner } },
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

  async deleteadvertisement(req: adsDto) {
    try{
        const findAd = await this.adsModel.findOne({adsId: req.adsId});
        if(findAd) {
            const eliminate = await this.adsModel.deleteOne({adsId: req.adsId});
            return {
                statusCode: HttpStatus.OK,
                message: "Advertisement Deleted Successfully",
                deleteStatus: eliminate,
            }
        } else {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Advertisement Not Deleted",
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
