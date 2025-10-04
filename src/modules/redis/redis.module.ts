import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { createClient } from 'redis';
import { Config, RedisConfig } from '../../configs/config.type';
import { RedisService } from './services/redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService<Config>) => {
        const redisConfig = configService.get<RedisConfig>('redis');
        console.log('Redis config:', redisConfig);

        const client = createClient({
          socket: {
            host: redisConfig.host,
            port: redisConfig.port,
          },
        });

        client.on('error', (err) => {
          console.error('❌ Redis Client Error:', err);
        });

        await client.connect();
        console.log('✅ Redis connected to', redisConfig.host);

        return client;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
