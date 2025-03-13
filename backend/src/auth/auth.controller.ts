/* eslint-disable prettier/prettier */
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Res,
  Req,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './models/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { AuthInterceptor } from './auth.interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    if (body.password !== body.passwordConfirm) {
      throw new BadRequestException('Passwords are not a match!');
    }

    const hashed = await bcrypt.hash(body.password, 12);

    const user = new UserEntity();
    user.first_name = body.first_name;
    user.last_name = body.last_name;
    user.email = body.email;
    user.password = hashed;

    return this.authService.create(user);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('This email does not exist.');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Passwords do not match.');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    };
  }

  @Get('user-by-email')
  async getUserByEmail(@Query('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.authService.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    };
  }

  @UseInterceptors(AuthInterceptor)
  @Get('user')
  async user(@Req() request: Request) {
    const cookie = request.cookies['jwt'];

    if (!cookie) {
      console.log('JWT cookie is missing');
      throw new BadRequestException('JWT cookie is missing');
    }
  
    try {
      const data = await this.jwtService.verifyAsync(cookie);
      return this.authService.findOneBy({ id: data.id });
    } catch (error) {
      console.log('JWT verification failed:', error.message);
      throw new BadRequestException('Invalid JWT token');
    }
  }

  @UseInterceptors(AuthInterceptor)
  @Post('logout')
  async logout(
    @Res({passthrough: true}) response: Response
  ){
    response.clearCookie('jwt');

    return {
      message: 'Success!'
    }
  }
} 