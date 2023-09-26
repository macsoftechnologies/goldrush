import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Offers } from './schema/offers.schema';
import { Model } from 'mongoose';
import { offerDto } from './dto/offers.dto';
var moment = require('moment');
@Injectable()
export class OffersService {
    constructor(@InjectModel(Offers.name) private readonly offersModel: Model<Offers>) {}

    async addOffers(req: offerDto) {
        try{
            req.date = moment(req.createdAt).format('DD-MM-YYYY');
            req.time = moment(req.createdAt).format('hh:mm:ss');
            const addoffer = await this.offersModel.create(req);
            if(addoffer) {
                return {
                    statusCode: HttpStatus.OK,
                    message: "Offer Added Successfully",
                    details: addoffer,
                }
            } else {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Invalid Request",
                }
            }
        } catch(error) {
            console.log(error);
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

    async getOffers() {
        try{
            const getoffers = await this.offersModel.find();
            if(getoffers) {
                const list = await this.offersModel.aggregate([
                    {
                        $lookup: {
                            from: "stores",
                            localField: "storeId",
                            foreignField: "storeId",
                            as: "storeId",
                        }
                    }
                ]);
                return {
                    statusCode: HttpStatus.OK,
                    message: "List of Offers",
                    details: list,
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

    async getOfferById(req: offerDto) {
        try{
            const findoffer = await this.offersModel.findOne({offerId: req.offerId});
            if(findoffer) {
                const offerDetail = await this.offersModel.aggregate([
                    {$match: {offerId: findoffer.offerId}},
                    {
                        $lookup: {
                            from: "stores",
                            localField: "storeId",
                            foreignField: "storeId",
                            as: "storeId",
                        }
                    }
                ]);
                return {
                    statusCode: HttpStatus.OK,
                    message: "Offer Details",
                    details: offerDetail,
                }
            } else {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Unbale to find the offer",
                }
            }
        } catch(error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

    async updateOffer(req: offerDto) {
        try{
            const findoffer = await this.offersModel.findOne({offerId: req.offerId});
            if(findoffer) {
                const updateoffer = await this.offersModel.updateOne({offerId: req.offerId},{
                    $set: {
                        storeId: req.storeId,
                        storeOffer: req.storeOffer,
                    }
                });
                if(updateoffer) {
                    return {
                        statusCode: HttpStatus.OK,
                        message: "Offer Details",
                        details: updateoffer,
                    }
                } else {
                    return {
                        statusCode: HttpStatus.BAD_REQUEST,
                        message: "Invalid request",
                    }
                }
            } else {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "Unbale to find the offer",
                }
            }
        } catch(error) {
            return {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: error,
            }
        }
    }

    async deleteOffer(req: offerDto) {
        try{
            const findoffer = await this.offersModel.findOne({offerId: req.offerId});
            if(findoffer) {
                const removeoffer = await this.offersModel.deleteOne({offerId: req.offerId});
                if(removeoffer) {
                    return {
                        statusCode: HttpStatus.OK,
                        message: "Offer Details",
                        details: removeoffer,
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
                    message: "Unbale to find the offer",
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
