import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  Min,
  Max,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarAdDto {
  @ApiProperty({
    example: 'BMW X5 in excellent condition',
    description: 'Advertisement Title',
  })
  @IsDefined({ message: 'Title is required' })
  @IsString()
  @IsNotEmpty({ message: 'Title should not be empty' })
  title: string;

  @ApiProperty({
    example: 'For sale BMW X5 from 2019 with 50,000 km...',
    description: 'Advertisement Description',
  })
  @IsDefined({ message: 'Description is required' })
  @IsString()
  @IsNotEmpty({ message: 'Description should not be empty' })
  description: string;

  @ApiProperty({ example: 25000, description: 'Car price' })
  @IsDefined({ message: 'Price is required' })
  @IsNumber()
  @Min(0, { message: 'The price cannot be negative' })
  price: number;

  @ApiProperty({
    example: 'EUR',
    description: 'Price currency',
    enum: ['USD', 'EUR', 'UAH'],
  })
  @IsDefined({ message: 'Currency is required' })
  @IsEnum(['USD', 'EUR', 'UAH'], { message: 'Invalid currency' })
  currency: 'USD' | 'EUR' | 'UAH';

  @ApiProperty({ example: 2019, description: 'Year of production of the car' })
  @IsDefined({ message: 'Year is required' })
  @IsNumber()
  @Min(1900, { message: 'Invalid year' })
  @Max(new Date().getFullYear(), { message: 'Year cannot be in the future' })
  year: number;

  @ApiProperty({ example: 50000, description: 'Car mileage' })
  @IsDefined({ message: 'Mileage is required' })
  @IsNumber()
  @Min(0, { message: 'Mileage cannot be negative' })
  mileage: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Car model ID',
  })
  @IsDefined({ message: 'Model ID is required' })
  @IsString()
  @IsNotEmpty({ message: 'Model ID should not be empty' })
  modelId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Main image for the car ad',
  })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
    description: 'Additional car ad images',
  })
  @IsOptional()
  @IsArray()
  file?: Express.Multer.File[];
}
