import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { adminDto } from './dto/admin.dto';
import { storeDto } from './dto/store.dto';
import { userDto } from './dto/user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { Role } from 'src/auth/guards/roles.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/addadmin')
  async addadmin(@Body() req: adminDto) {
    try {
      const addAdmin = await this.userService.createAdmin(req);
      return addAdmin;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @Post('/loginadmin')
  async loginadmin(@Body() req: adminDto) {
    try {
      const findAdmin = await this.userService.loginAdmin(req);
      return findAdmin;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @Post('/adduser')
  async adduser(@Body() req: userDto) {
    try {
      const addUser = await this.userService.createUser(req);
      return addUser;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @Post('/loginuser')
  async loginuser(@Body() req: userDto) {
    try {
      const findUser = await this.userService.loginUser(req);
      return findUser;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @UseGuards(JwtGuard)
  @Get('/getuserlist')
  async getUsersList() {
    try {
      const findUser = await this.userService.getUsersList();
      return findUser;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getuser')
  async getUserById(@Body() req: userDto) {
    try {
      const findUser = await this.userService.getUserById(req);
      return findUser;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post('/updateuser')
  async updateUser(@Body() req: userDto) {
    try {
      const moderate = await this.userService.updateUser(req);
      return moderate;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Post('/deleteuser')
  async deleteUser(@Body() req: userDto) {
    try {
      const eliminate = await this.userService.deleteUser(req);
      return eliminate;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @Post('/createstore')
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
  async addStore(@Body() req: storeDto, @UploadedFiles() image) {
    try {
      const addStore = await this.userService.createStore(req, image);
      return addStore;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @Post('/loginstore')
  async loginstore(@Body() req: storeDto) {
    try {
      const findUser = await this.userService.loginStore(req);
      return findUser;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @UseGuards(JwtGuard)
  @Get('/getstorelist')
  async getStoresList() {
    try {
      const findUser = await this.userService.getStoresList();
      return findUser;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @UseGuards(JwtGuard)
  @Post('/getstore')
  async getStoreById(@Body() req: storeDto) {
    try {
      const findUser = await this.userService.getStoreById(req);
      return findUser;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.STORE)
  @Post('/updatestore')
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
  async updateStore(@Body() req: storeDto, @UploadedFiles() image) {
    try {
      const moderate = await this.userService.storeUpdate(req, image);
      return moderate;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STORE)
  @Post('/deletestore')
  async deleteStore(@Body() req: storeDto) {
    try {
      const eliminate = await this.userService.deleteStore(req);
      return eliminate;
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      };
    }
  }
}
