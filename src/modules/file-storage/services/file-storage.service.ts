import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';
import { Express } from 'express';
import { createS3Client } from '../../../common/factories/s3-client.factory';

@Injectable()
export class FileStorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly useMinio: boolean;
  private readonly minioEndpoint: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = createS3Client(this.configService);

    this.useMinio = this.configService.get<boolean>('minio.useMinio') ?? false;
    this.bucket = this.useMinio
      ? this.configService.get<string>('minio.bucketName')
      : this.configService.get<string>('aws.bucketName');

    this.minioEndpoint = this.configService.get<string>('minio.endpoint') || '';
    console.log('🪣 Storage bucket in uso:', this.bucket);
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = '',
  ): Promise<{ url: string; key: string }> {
    const filename = folder
      ? `${folder}/${uuid()}-${file.originalname}`
      : `${uuid()}-${file.originalname}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3.send(command);

      let url: string;
      if (this.useMinio && this.minioEndpoint) {
        url = `${this.minioEndpoint}/${this.bucket}/${filename}`;
      } else {
        const endpoint = this.configService.get<string>('aws.endpoint');
        const region = this.configService.get<string>('aws.region');
        url = endpoint
          ? `${endpoint}/${this.bucket}/${filename}`
          : `https://${this.bucket}.s3.${region}.amazonaws.com/${filename}`;
      }

      return { url, key: filename };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      throw new InternalServerErrorException(message);
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (!key) return;

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3.send(command);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      throw new InternalServerErrorException(message);
    }
  }
}
