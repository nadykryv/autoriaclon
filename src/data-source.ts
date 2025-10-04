import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const useSSL = process.env.DATABASE_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  entities: [path.join(__dirname, 'database/entities/*.{ts,js}')],
  migrations: [path.join(__dirname, 'database/migrations/*.{ts,js}')],
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',
});
