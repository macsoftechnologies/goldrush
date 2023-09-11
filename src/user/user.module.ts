import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, userSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { Admin, adminSchema } from './schema/admin.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Store, storeSchema } from './schema/store.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: userSchema},{name: Store.name, schema: storeSchema},{name: Admin.name, schema: adminSchema}])],
  controllers: [UserController],
  providers: [UserService, AuthService, JwtService,{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }]
})
export class UserModule {}
