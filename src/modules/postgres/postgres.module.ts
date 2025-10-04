import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Config, DatabaseConfig } from '../../configs/config.type';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const dbConfig = configService.get<DatabaseConfig>('database');
        const useSSL = process.env.DATABASE_SSL === 'true';

        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.name,
          ssl: useSSL ? { rejectUnauthorized: true } : false,
          entities: [path.join(__dirname, '../../database/entities/*.{ts,js}')],
          migrations: [
            path.join(__dirname, '../../database/migrations/*.{ts,js}'),
          ],
          synchronize: dbConfig.synchronize,
          logging: dbConfig.logging,
          migrationsRun: false,
        };
      },
    }),
  ],
})
export class PostgresModule {}
