import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CarsService } from './services/cars.service';
import { CreateCarBrandDto } from './dto/req/create-car-brand.dto';
import { CreateCarModelDto } from './dto/req/create-car-model.dto';
import { CarModel } from '../../database/entities/car-model.entity';
import { BaseQueryDto } from '../../common/decorators/pagination/dto/pagination-query.dto';
import { ApiPaginatedResponse } from '../../common/decorators/pagination/api-paginated-response.decorator';

@ApiTags('cars')
@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post('brands')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car brand' })
  @ApiResponse({ status: 201, description: 'Brand successfully created' })
  createBrand(@Body() createCarBrandDto: CreateCarBrandDto) {
    return this.carsService.createBrand(createCarBrandDto);
  }

  @Get('brands')
  @ApiOperation({ summary: 'Get all car brands' })
  @ApiResponse({ status: 200, description: 'List of car brands' })
  findAllBrands() {
    return this.carsService.findAllBrands();
  }

  @Get('brands/:id')
  @ApiOperation({ summary: 'Get a specific car brand' })
  @ApiResponse({ status: 200, description: 'Car brand found' })
  @ApiResponse({ status: 404, description: 'Car brand not found' })
  findBrandById(@Param('id') id: string) {
    return this.carsService.findBrandById(id);
  }

  @Post('brands/:brandId/models')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car model' })
  @ApiResponse({ status: 201, description: 'Model successfully created' })
  createModel(
    @Param('brandId') brandId: string,
    @Body() createCarModelDto: CreateCarModelDto,
  ) {
    return this.carsService.createModel(brandId, createCarModelDto);
  }

  @Get('models/paginated')
  @ApiOperation({ summary: 'Paginated list of models' })
  @ApiPaginatedResponse(CarModel)
  findAllModelsPaginated(@Query() query: BaseQueryDto) {
    return this.carsService.findAllModelsPaginated(query);
  }

  @Get('models/:id')
  @ApiOperation({ summary: 'Get a specific car model' })
  @ApiResponse({ status: 200, description: 'Car model found' })
  @ApiResponse({ status: 404, description: 'Car model not found' })
  findModelById(@Param('id') id: string) {
    return this.carsService.findModelById(id);
  }

  @Get('brands/:brandId/models')
  @ApiOperation({ summary: 'Get all models of a specific brand' })
  @ApiResponse({ status: 200, description: 'List of car models' })
  findModelsByBrand(@Param('brandId') brandId: string) {
    return this.carsService.findModelsByBrand(brandId);
  }
}
