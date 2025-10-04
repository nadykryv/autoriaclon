import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty } from 'class-validator';

export class UploadListingImagesDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    isArray: true,
    description: 'Array of image files for the car listing',
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'At least one image is required' })
  files: Express.Multer.File[];
}