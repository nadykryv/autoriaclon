import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configs/configuration';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdsModule } from './modules/ads/ads.module';
import { CarsModule } from './modules/cars/cars.module';
import { RolesModule } from './modules/roles/roles.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { PostgresModule } from './modules/postgres/postgres.module';
import { RedisModule } from './modules/redis/redis.module';
import { SeedModule } from './database/seeds/seed.module';
import { AppController } from './app.controller';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),
    LoggerModule,
    PostgresModule,
    RedisModule,
    AuthModule,
    UsersModule,
    AdsModule,
    RolesModule,
    CurrencyModule,
    CarsModule,
    SeedModule,
    NotificationsModule,
    FileStorageModule,
    PermissionsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
