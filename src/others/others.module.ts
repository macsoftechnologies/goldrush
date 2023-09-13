import { Module } from '@nestjs/common';
import { OthersService } from './others.service';
import { OthersController } from './others.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  VirtualCalling,
  virtualCallingSchema,
} from './schema/virtualcalling.schema';
import { User, userSchema } from 'src/user/schema/user.schema';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Ads, adsSchema } from './schema/ads.schema';
import { Store, storeSchema } from 'src/user/schema/store.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Ads.name, schema: adsSchema },
      { name: Store.name, schema: storeSchema },
      { name: VirtualCalling.name, schema: virtualCallingSchema },
    ]),
  ],
  controllers: [OthersController],
  providers: [
    OthersService,
    AuthService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class OthersModule {}
