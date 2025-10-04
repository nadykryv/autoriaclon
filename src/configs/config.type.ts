export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  sentry: SentryConfig;
  jwt: JwtConfig;
  aws: AwsConfig;
}

export interface AppConfig {
  env: string;
  port: number;
  host: string;
}

export interface DatabaseConfig {
  type: 'postgres';
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
  logging: boolean;
  ssl: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export type SentryConfig = {
  dsn: string;
  env: string;
  debug: boolean;
};

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AwsConfig {
  endpoint: string;
  region: string;
  accessKey: string;
  secretKey: string;
  bucketName: string;
  ACL: string;
}
