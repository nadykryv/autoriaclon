import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../database/entities/user.entity';
import { CreateUserDto } from '../dto/req/create-user.dto';
import { UpdateUserDto } from '../dto/req/update-user.dto';
import { FileStorageService } from '../../file-storage/services/file-storage.service';
import { BaseQueryDto } from '../../../common/decorators/pagination/dto/pagination-query.dto';
import { PaginatedResult } from '../../../common/interfaces/pagination.interface';
import { RolesService } from '../../roles/services/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private rolesService: RolesService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['roles', 'ads'] });
  }

  async findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles', 'ads'],
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.findOne(id);
    if (!user || !user.isActive) return null;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async countUserAds(userId: string): Promise<number> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['ads'],
    });
    return user ? user.ads.length : 0;
  }

  async removeRefreshToken(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { hashedRefreshToken: null });
  }

  async setRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { hashedRefreshToken });
  }

  async findPaginated(
    query: BaseQueryDto,
    role?: string,
  ): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, sort = 'id', order = 'ASC', search } = query;

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .leftJoinAndSelect('user.ads', 'ads');

    if (search) {
      qb.andWhere('(user.email ILIKE :search OR user.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (role) {
      qb.andWhere('role.name = :role', { role });
    }

    const allowedSortFields = ['id', 'email', 'name', 'createdAt'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'id';
    qb.orderBy(
      `user.${sortField}`,
      order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    );

    qb.skip((page - 1) * limit).take(limit);

    const [entities, countItems] = await qb.getManyAndCount();
    const pages = Math.ceil(countItems / limit);
    return { page, pages, countItems, entities };
  }

  /** ---  UPGRADE --- */
  async upgradeToPremiun(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    user.accountType = 'premium';
    return this.usersRepository.save(user);
  }

  async addRoleToUser(userId: string, roleName: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const role = await this.rolesService.findByName(roleName);
    if (!role) {
      throw new NotFoundException(`Role "${roleName}" not found`);
    }
    const hasRole = user.roles.some((r) => r.id === role.id);
    if (hasRole) {
      return user;
    }
    user.roles.push(role);
    return this.usersRepository.save(user);
  }

  async removeRoleFromUser(userId: string, roleName: string): Promise<User> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const role = await this.rolesService.findByName(roleName);
    if (!role) {
      throw new NotFoundException(`Role "${roleName}" not found`);
    }
    user.roles = user.roles.filter((r) => r.id !== role.id);
    return this.usersRepository.save(user);
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<void> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (user.avatarKey) {
      await this.fileStorageService.deleteFile(user.avatarKey);
    }

    const { url, key } = await this.fileStorageService.uploadFile(
      file,
      'upload/avatars',
    );

    user.avatarUrl = url;
    user.avatarKey = key;

    await this.usersRepository.save(user);
  }

  async deleteAvatar(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user || !user.avatarKey) return;

    await this.fileStorageService.deleteFile(user.avatarKey);

    user.avatarUrl = null;
    user.avatarKey = null;

    await this.usersRepository.save(user);
  }
}
