import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorageService } from './services/file-storage.service';
import { Express } from 'express';

@Controller('files')
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const result = await this.fileStorageService.uploadFile(file);
      return {
        url: result.url,
        key: result.key,
        message: '✅ Upload successful',
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      throw new InternalServerErrorException(message);
    }
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    try {
      const decodedKey = decodeURIComponent(key);
      await this.fileStorageService.deleteFile(decodedKey);
      return { message: '🗑️ File deleted successfully' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      throw new InternalServerErrorException(message);
    }
  }
}
