import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { User } from '../entities/user.entity';
import { CarBrand } from '../entities/car-brand.entity';
import { CarModel } from '../entities/car-model.entity';
import { CarAd } from '../entities/car-ad.entity';
import { SeedService } from './services/seed.service';
import { Role } from '../entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      Permission,
      User,
      CarBrand,
      CarModel,
      CarAd,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
