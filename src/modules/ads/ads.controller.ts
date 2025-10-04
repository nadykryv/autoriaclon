import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { AdsService } from './services/ads.service';
import { CreateCarAdDto } from './dto/req/create-car-ad.dto';
import { UpdateCarAdDto } from './dto/req/update-car-ad.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadListingImagesDto } from './dto/req/upload-listing-images.dto';
import { CarAdResponseDto } from './dto/res/car-ad-response.dto';
import { BaseQueryDto } from '../../common/decorators/pagination/dto/pagination-query.dto';
import { ApiPaginatedResponse } from '../../common/decorators/pagination/api-paginated-response.decorator';
import { AdsMapper } from './services/ads.mapper';
import { AuthRequest } from '../../common/interfaces/auth-request.interface';

@ApiTags('ads')
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new car ad' })
  @ApiResponse({ status: 201, description: 'Car ad created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or ads limit reached',
  })
  create(@Request() req: AuthRequest, @Body() createCarAdDto: CreateCarAdDto) {
    return this.adsService.create(req.user.id.toString(), createCarAdDto);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get paginated list of active car ads' })
  @ApiPaginatedResponse(CarAdResponseDto)
  async findAllPaginated(@Query() query: BaseQueryDto) {
    const result = await this.adsService.findAllPaginated(query);
    return {
      ...result,
      entities: result.entities.map((ad) => AdsMapper.toResDto(ad)),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Ottieni tutti gli annunci attivi' })
  @ApiResponse({ status: 200, description: 'Lista di annunci' })
  findAll() {
    return this.adsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific car ad' })
  @ApiResponse({ status: 200, description: 'Car ad found' })
  @ApiResponse({ status: 404, description: 'Car ad not found' })
  findOne(@Param('id') id: string) {
    return this.adsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a car ad' })
  @ApiResponse({ status: 200, description: 'Car ad updated successfully' })
  @ApiResponse({ status: 404, description: 'Car ad not found' })
  update(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() updateCarAdDto: UpdateCarAdDto,
  ) {
    return this.adsService.update(id, req.user.id.toString(), updateCarAdDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a car ad' })
  @ApiResponse({ status: 200, description: 'Car ad deleted successfully' })
  @ApiResponse({ status: 404, description: 'Car ad not found' })
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.adsService.remove(id, req.user.id.toString());
  }

  @Post(':id/view')
  @ApiOperation({
    summary: 'Increment the view count of a car ad',
  })
  @ApiResponse({ status: 200, description: 'View count incremented' })
  @ApiResponse({ status: 404, description: 'Car ad not found' })
  incrementViews(@Param('id') id: string) {
    return this.adsService.incrementViews(id);
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadListingImagesDto })
  @ApiOperation({ summary: 'Upload images for a car ad' })
  async uploadListingImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.adsService.uploadListingImages(id, files, 'upload/cars');
  }

  @Delete(':adId/images/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a single image from a car ad' })
  async deleteImage(@Param('adId') adId: string, @Param('key') key: string) {
    return this.adsService.deleteImage(adId, key);
  }
}
