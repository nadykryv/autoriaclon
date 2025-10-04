import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './services/users.service';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { BaseQueryDto } from '../../common/decorators/pagination/dto/pagination-query.dto';
import { ApiPaginatedResponse } from '../../common/decorators/pagination/api-paginated-response.decorator';
import { UserResponseDto } from './dto/res/users.response.dto';
import { UserMapper } from './services/user.mapper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** --- CRUD USERS --- */
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get all users with pagination, search, sorting, and optional role filter',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'sort',
    required: false,
    example: 'id',
    enum: ['id', 'email', 'name', 'createdAt'],
  })
  @ApiQuery({
    name: 'order',
    required: false,
    example: 'ASC',
    enum: ['ASC', 'DESC'],
  })
  @ApiQuery({ name: 'search', required: false, example: 'admin' })
  @ApiQuery({ name: 'role', required: false, example: 'admin' })
  @ApiPaginatedResponse(UserResponseDto)
  findAll(@Query() query: BaseQueryDto, @Query('role') role?: string) {
    return this.usersService.findPaginated(query, role).then((paginated) => ({
      ...paginated,
      entities: paginated.entities.map((user) => UserMapper.toResDto(user)),
    }));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific user' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  /** --- UPGRADE --- */
  @Patch(':id/premium')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade a user to premium' })
  @ApiResponse({ status: 200, description: 'User upgraded to premium' })
  @ApiResponse({ status: 404, description: 'User not found' })
  upgradeToPremiun(@Param('id') id: string) {
    return this.usersService.upgradeToPremiun(id);
  }

  @Post(':id/roles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add role to user' })
  @ApiResponse({ status: 200, description: 'Role added to user' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async addRole(@Param('id') id: string, @Body('roleName') roleName: string) {
    return this.usersService.addRoleToUser(id, roleName);
  }

  @Delete(':id/roles/:roleName')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({ status: 200, description: 'Role removed from user' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async removeRole(
    @Param('id') id: string,
    @Param('roleName') roleName: string,
  ) {
    return this.usersService.removeRoleFromUser(id, roleName);
  }

  @Patch(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new NotFoundException('File not found');
    }
    await this.usersService.uploadAvatar(id, file);
    return { message: 'Avatar updated successfully' };
  }

  @Patch(':id/avatar/delete')
  async deleteUserAvatar(@Param('id') id: string) {
    await this.usersService.deleteAvatar(id);
    return { message: 'Avatar successfully removed' };
  }
}
