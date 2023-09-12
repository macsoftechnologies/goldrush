import { Body, Controller, Get, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { offerDto } from './dto/offers.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @UseGuards(JwtGuard,RolesGuard)
  @Roles(Role.ADMIN, Role.STORE)
  @Post('addoffer')
  async addOffer(@Body() req: offerDto) {
    try{
      const addOffer = await this.offersService.addOffers(req);
      return addOffer
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Get('getoffers')
  async getOfferList() {
    try{
      const getOffers = await this.offersService.getOffers();
      return getOffers
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('getofferbyid')
  async getOfferById(@Body() req: offerDto) {
    try{
      const getOffer = await this.offersService.getOfferById(req);
      return getOffer
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STORE)
  @Post('updateoffer')
  async updateOffer(@Body() req: offerDto) {
    try{
      const updateOffer = await this.offersService.updateOffer(req);
      return updateOffer
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STORE)
  @Post('deleteoffer')
  async deleteOffer(@Body() req: offerDto) {
    try{
      const deleteOffer = await this.offersService.deleteOffer(req);
      return deleteOffer
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }
}
