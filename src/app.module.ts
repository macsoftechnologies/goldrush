import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';
import { ProductsModule } from './products/products.module';
import { OffersModule } from './offers/offers.module';
import { OthersModule } from './others/others.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://macsof:macsof@nextlevelcarwash.yjs3i.mongodb.net/goldrush?retryWrites=true&w=majority',
    ),
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      useFactory: () => ({
        secretOrKey: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '10s',
        },
      }),
    }),
    ProductsModule,
    OffersModule,
    OthersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtService,
  ],
})
export class AppModule {}
