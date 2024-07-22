import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './shared/modules/database.module';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { LoggerService } from './shared/services/logger.service';
import { Module } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3h' }
    }),
    DatabaseModule,
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {}
