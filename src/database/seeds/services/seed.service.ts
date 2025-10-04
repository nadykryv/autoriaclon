import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { seedRolesAndAdmin } from '../data/seed-roles';
import {
  seedPermissions,
  assignPermissionsToRoles,
} from '../data/seed-permissions';
import { seedUsers } from '../data/seed-users';
import { seedCarBrands, seedCarModels } from '../data/seed-cars';
import { seedCarAds } from '../data/seed-ads';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';
import { User } from '../../entities/user.entity';
import { CarBrand } from '../../entities/car-brand.entity';
import { CarModel } from '../../entities/car-model.entity';
import { CarAd } from '../../entities/car-ad.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
    @InjectRepository(CarAd) private carAdRepository: Repository<CarAd>,
  ) {}

  async seed(): Promise<void> {
    console.log('Initializing seed data...');
    await seedRolesAndAdmin(this.rolesRepository, this.usersRepository);
    await seedPermissions(this.permissionsRepository);
    await assignPermissionsToRoles(
      this.rolesRepository,
      this.permissionsRepository,
    );
    await seedCarBrands(this.carBrandRepository);
    await seedCarModels(this.carBrandRepository, this.carModelRepository);
    await seedUsers(this.usersRepository, this.rolesRepository);
    await seedCarAds(
      this.carAdRepository,
      this.usersRepository,
      this.carModelRepository,
    );
    console.log('Initialization completed!');
  }
}
