import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Offers, offerSchema } from './schema/offers.schema';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MongooseModule.forFeature([{name: Offers.name, schema: offerSchema}])],
  controllers: [OffersController],
  providers: [OffersService,{
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
  JwtService,]
})
export class OffersModule {}
