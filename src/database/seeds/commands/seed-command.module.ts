import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedModule } from '../seed.module';
import { SeedCommand } from './seed.command';
import configuration from '../../../configs/configuration';
import { Config, DatabaseConfig } from '../../../configs/config.type';
import { PostgresModule } from '../../../modules/postgres/postgres.module';
import { RedisModule } from '../../../modules/redis/redis.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        const useSSL = dbConfig.ssl || false;
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.name,
          ssl: useSSL ? { rejectUnauthorized: true } : true,
          entities: [__dirname + '/../../../**/*.entity.{ts,js}'],
          //synchronize: true,
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
        };
      },
    }),

    PostgresModule,
    RedisModule,
    SeedModule,
  ],
  providers: [SeedCommand],
})
export class SeedCommandModule {}
