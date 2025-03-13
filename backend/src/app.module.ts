import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResetModule } from './reset/reset.module';
import { AuthInterceptor } from './auth/auth.interceptor';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'malatajna',
        database: 'nestdb',
        autoLoadEntities: true,
        synchronize: true, 
      }),
    ResetModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
  ],
})
export class AppModule {}

