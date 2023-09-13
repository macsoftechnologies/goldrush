import { Body, Controller, Get, HttpStatus, Post, UseGuards, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { OthersService } from './others.service';
import { virtualCallingScheduleDto } from './dto/virtualcalling.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';
import { adsDto } from './dto/ads.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('others')
export class OthersController {
  constructor(private readonly othersService: OthersService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.USER)
  @Post('/schedulevirtualcall')
  async scheduleVirtualCall(@Body() req: virtualCallingScheduleDto) {
    try{
      const add = await this.othersService.scheduleCall(req);
      return add
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Get('/schedulevirtualcallslist')
  async GetCallSchedulesList() {
    try{
      const get = await this.othersService.getSchedules();
      return get
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/schedulevirtualcallbyid')
  async GetCallScheduleById(@Body() req: virtualCallingScheduleDto) {
    try{
      const get = await this.othersService.getScheduleById(req);
      return get
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/schedulevirtualcallsbyuserid')
  async GetCallScheduleByUserId(@Body() req: virtualCallingScheduleDto) {
    try{
      const get = await this.othersService.getScheduleByUserId(req);
      return get
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/schedulevirtualcallsbystoreid')
  async GetCallScheduleByStoreId(@Body() req: virtualCallingScheduleDto) {
    try{
      const get = await this.othersService.getScheduleByStoreId(req);
      return get
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/updatevirtualcall')
  async updateCall(@Body() req: virtualCallingScheduleDto) {
    try{
      const get = await this.othersService.updateSchedule(req);
      return get
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/deletevirtualcall')
  async deleteCall(@Body() req: virtualCallingScheduleDto) {
    try{
      const get = await this.othersService.deleteScheduleCall(req);
      return get
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard,RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/addads')
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
  async addAds(@Body() req: adsDto, @UploadedFiles() image) {
    try{
      const addad = await this.othersService.addAd(req, image);
      return addad
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Get('/getads')
  async getAdsList() {
    try{
      const list = await this.othersService.getAdsList();
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getadbyid')
  async getAdById(@Body() req: adsDto) {
    try{
      const list = await this.othersService.getAdById(req);
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getadsofstore')
  async getAdsOfStore(@Body() req: adsDto) {
    try{
      const list = await this.othersService.getAdsOfStore(req);
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/updateadvertisement')
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
  async updateAd(@Body() req: adsDto, @UploadedFiles() image) {
    try{
      const list = await this.othersService.updateAd(req, image);
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard)
  @Post('/deletebannerimage')
  async deleteBannerImage(@Body() req: adsDto) {
    try{
      const list = await this.othersService.deletebanner(req);
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/deleteadvertisement')
  async deleteAdvertisement(@Body() req: adsDto) {
    try{
      const list = await this.othersService.deleteadvertisement(req);
      return list
    } catch(error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      }
    }
  }

}
