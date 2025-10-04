import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBrand } from '../../../database/entities/car-brand.entity';
import { CarModel } from '../../../database/entities/car-model.entity';
import { CreateCarBrandDto } from '../dto/req/create-car-brand.dto';
import { CreateCarModelDto } from '../dto/req/create-car-model.dto';
import { BaseQueryDto } from '../../../common/decorators/pagination/dto/pagination-query.dto';
import { PaginatedResult } from '../../../common/interfaces/pagination.interface';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(CarBrand)
    private carBrandRepository: Repository<CarBrand>,
    @InjectRepository(CarModel)
    private carModelRepository: Repository<CarModel>,
  ) {}

  async createBrand(createCarBrandDto: CreateCarBrandDto): Promise<CarBrand> {
    const brand = this.carBrandRepository.create(createCarBrandDto);
    return this.carBrandRepository.save(brand);
  }

  async findAllBrands(): Promise<CarBrand[]> {
    return this.carBrandRepository.find({
      relations: ['models'],
    });
  }

  async findBrandById(id: string): Promise<CarBrand> {
    const brand = await this.carBrandRepository.findOne({
      where: { id },
      relations: ['models'],
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    return brand;
  }

  async createModel(
    brandId: string,
    createCarModelDto: CreateCarModelDto,
  ): Promise<CarModel> {
    const brand = await this.findBrandById(brandId);

    const model = this.carModelRepository.create({
      ...createCarModelDto,
      brand,
    });

    return this.carModelRepository.save(model);
  }

  async findAllModelsPaginated(
    query: BaseQueryDto,
  ): Promise<PaginatedResult<CarModel>> {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC', search } = query;

    const qb = this.carModelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.brand', 'brand');

    if (search) {
      qb.where('model.name ILIKE :search OR brand.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    qb.orderBy(`model.${sort}`, order as 'ASC' | 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [entities, count] = await qb.getManyAndCount();

    return {
      page,
      pages: Math.ceil(count / limit),
      countItems: count,
      entities,
    };
  }

  async findModelById(id: string): Promise<CarModel> {
    const model = await this.carModelRepository.findOne({
      where: { id },
      relations: ['brand'],
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }
    return model;
  }

  async findModelsByBrand(brandId: string): Promise<CarModel[]> {
    return this.carModelRepository.find({
      where: { brand: { id: brandId } },
      relations: ['brand'],
    });
  }
}
