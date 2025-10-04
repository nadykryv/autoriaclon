import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarAd } from '../../../database/entities/car-ad.entity';
import { UsersService } from '../../users/services/users.service';
import { CreateCarAdDto } from '../dto/req/create-car-ad.dto';
import { UpdateCarAdDto } from '../dto/req/update-car-ad.dto';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { BaseQueryDto } from '../../../common/decorators/pagination/dto/pagination-query.dto';
import { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(CarAd)
    private carAdRepository: Repository<CarAd>,
    private usersService: UsersService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(userId: string, createCarAdDto: CreateCarAdDto): Promise<CarAd> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.accountType === 'base') {
      const adsCount = await this.usersService.countUserAds(userId);
      if (adsCount >= 1) {
        throw new Error('Base account users can post only one ad');
      }
    }

    if (this.containsInappropriateLanguage(createCarAdDto.description)) {
      throw new Error('Ad contains inappropriate language');
    }

    const carAd = this.carAdRepository.create({
      ...createCarAdDto,
      seller: { id: userId } as User,
      status: 'active',
    });

    return this.carAdRepository.save(carAd);
  }

  async update(
    id: string,
    userId: string,
    updateCarAdDto: UpdateCarAdDto,
  ): Promise<CarAd> {
    const carAd = await this.carAdRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!carAd) {
      throw new Error('Ad not found');
    }

    if (carAd.seller?.id?.toString() !== userId.toString()) {
      throw new Error('Not authorized to update this ad');
    }

    if (
      updateCarAdDto.description &&
      this.containsInappropriateLanguage(updateCarAdDto.description)
    ) {
      carAd.rejectionCount += 1;

      if (carAd.rejectionCount >= 3) {
        carAd.status = 'rejected';
        await this.carAdRepository.save(carAd);
        throw new Error('Ad rejected too many times and deactivated');
      }

      throw new Error('Ad contains inappropriate language');
    }

    Object.assign(carAd, updateCarAdDto);

    return this.carAdRepository.save(carAd);
  }

  async remove(id: string, userId: string): Promise<void> {
    const carAd = await this.carAdRepository.findOne({
      where: { id },
      relations: ['seller'],
    });

    if (!carAd) {
      throw new Error('Ad not found');
    }

    if (carAd.seller?.id?.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this ad');
    }

    await this.carAdRepository.delete(id);
  }

  async findAll(): Promise<CarAd[]> {
    return this.carAdRepository.find({
      where: { status: 'active' },
      relations: ['model', 'model.brand', 'seller'],
    });
  }

  async findAllPaginated(query: BaseQueryDto): Promise<PaginatedResult<CarAd>> {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC', search } = query;

    const qb = this.carAdRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.model', 'model')
      .leftJoinAndSelect('model.brand', 'brand')
      .leftJoinAndSelect('ad.seller', 'seller')
      .where('ad.status = :status', { status: 'active' });

    if (search) {
      qb.andWhere(
        'ad.title ILIKE :search OR ad.description ILIKE :search OR brand.name ILIKE :search OR model.name ILIKE :search',
        { search: `%${search}%` },
      );
    }

    qb.orderBy(`ad.${sort}`, order as 'ASC' | 'DESC')
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

  async findOne(id: string): Promise<CarAd> {
    return this.carAdRepository.findOne({
      where: { id },
      relations: ['model', 'model.brand', 'seller'],
    });
  }

  async incrementViews(id: string): Promise<void> {
    await this.carAdRepository.increment({ id }, 'views', 1);
  }

  private containsInappropriateLanguage(text: string): boolean {
    const inappropriateWords = ['badword1', 'badword2', 'badword3'];

    return inappropriateWords.some((word) =>
      text.toLowerCase().includes(word.toLowerCase()),
    );
  }

  async uploadListingImages(
    adId: string,
    files: Express.Multer.File[],
    folder: string = 'upload/cars',
  ): Promise<CarAd> {
    const ad = await this.findOne(adId);
    if (!ad) throw new NotFoundException('CarAd not found');

    if (ad.images?.length) {
      for (const img of ad.images) {
        await this.fileStorageService.deleteFile(img.key);
      }
    }

    const uploadedImages: { url: string; key: string }[] = [];
    for (const file of files) {
      const { url, key } = await this.fileStorageService.uploadFile(
        file,
        folder,
      );
      uploadedImages.push({ url, key });
    }

    ad.images = uploadedImages;
    return this.carAdRepository.save(ad);
  }

  async deleteImage(adId: string, key: string): Promise<CarAd> {
    const ad = await this.findOne(adId);
    if (!ad) throw new NotFoundException('CarAd not found');

    await this.fileStorageService.deleteFile(key);

    ad.images = ad.images.filter((img) => img.key !== key);

    return this.carAdRepository.save(ad);
  }
}
