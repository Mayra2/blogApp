import {
  Controller,
  Post,
  Body,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetEntity } from './reset.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';

@Controller('reset')
export class ResetController {
  constructor(
    private resetService: ResetService,
    private mailerService: MailerService,
    private authService: AuthService,
  ) {}

  @Post('forgot')
  async forgot(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const token = Math.random().toString(20).substring(2, 12);
    const resetEntity = new ResetEntity();
    resetEntity.email = email;
    resetEntity.token = token;

    await this.resetService.create(resetEntity);

    const url = `http://localhost:3000/reset/forgot/${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `Click <a href="${url}">here</a> to reset your password!`,
    });

    return {
      message: 'Check your email!',
    };
  }

  @Post('reset')
  async reset(
    @Body('token') token: string,
    @Body('password') password: string,
    @Body('passwordConfirm') passwordConfirm: string,
  ) {
    if (password !== passwordConfirm) {
      throw new BadRequestException('Passwords do not match');
    }

    console.log('Token:', token); // Log the token
    const reset = await this.resetService.findOne({ token });
    if (!reset) {
      throw new NotFoundException('Invalid or expired token');
    }

    console.log('Reset entity:', reset); // Log the reset entity
    const email = reset.email;

    console.log('Email:', email); // Log the email
    const user = await this.authService.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await this.authService.update(user.id, { password: hashedPassword });

    return {
      message: 'Success!',
    };
  }
}
