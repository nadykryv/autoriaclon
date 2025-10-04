import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

export const createS3Client = (configService: ConfigService): S3Client => {
  const useMinio = configService.get<boolean>('minio.useMinio') ?? false;

  if (useMinio) {
    return new S3Client({
      region: configService.get<string>('minio.region') || 'us-east-1',
      endpoint: configService.get<string>('minio.endpoint'),
      credentials: {
        accessKeyId: configService.get<string>('minio.accessKey'),
        secretAccessKey: configService.get<string>('minio.secretKey'),
      },
      forcePathStyle: true,
    });
  }

  return new S3Client({
    region: configService.get<string>('aws.region'),
    credentials: {
      accessKeyId: configService.get<string>('aws.accessKey'),
      secretAccessKey: configService.get<string>('aws.secretKey'),
    },
    ...(configService.get<string>('aws.endpoint') && {
      endpoint: configService.get<string>('aws.endpoint'),
    }),
    forcePathStyle: !!configService.get<string>('aws.endpoint'),
  });
};
