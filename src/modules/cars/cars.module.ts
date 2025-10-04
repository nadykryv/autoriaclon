import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarsController } from './cars.controller';
import { CarBrand } from '../../database/entities/car-brand.entity';
import { CarModel } from '../../database/entities/car-model.entity';
import { CarsService } from './services/cars.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarBrand, CarModel])],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}