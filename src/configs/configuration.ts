import * as process from 'process';
import { Config } from './config.type';

function parseBoolean(value?: string, defaultValue = false): boolean {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value) return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export default (): Config => ({
  app: {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
  },

  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    logging: process.env.DATABASE_LOGGING === 'true',
    ssl: process.env.DATABASE_SSL === 'true',
  },

  sentry: {
    dsn: process.env.SENTRY_DSN || '',
    env: process.env.SENTRY_ENV || '',
    debug: parseBoolean(process.env.SENTRY_DEBUG, false),
  },

  jwt: {
    secret: process.env.JWT_SECRET || '',
    expiresIn: process.env.JWT_EXPIRATION || '',
  },

  redis: {
    host: process.env.REDIS_HOST,
    port: parseNumber(process.env.REDIS_PORT, 6379),
  },

  aws: {
    accessKey: process.env.AWS_S3_ACCESS_KEY || '',
    secretKey: process.env.AWS_S3_SECRET_KEY || '',
    bucketName: process.env.AWS_S3_BUCKET_NAME || '',
    region: process.env.AWS_S3_REGION || '',
    ACL: process.env.AWS_S3_ACL || '',
    endpoint: process.env.AWS_S3_ENDPOINT || '',
  },
});
