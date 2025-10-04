import { CarBrand } from '../../../database/entities/car-brand.entity';
import { CarModel } from '../../../database/entities/car-model.entity';
import { CarBrandResponseDto } from '../dto/res/car-brand.response.dto';
import { CarModelResponseDto } from '../dto/res/car-model.response.dto';

export class CarsMapper {
  static toBrandResDto(brand: CarBrand): CarBrandResponseDto {
    return {
      id: brand.id,
      name: brand.name,
      models: brand.models
        ? brand.models.map((m) => ({
          id: m.id,
          name: m.name,
        }))
        : [],
    };
  }

  static toModelResDto(model: CarModel): CarModelResponseDto {
    return {
      id: model.id,
      name: model.name,
      brand: model.brand
        ? { id: model.brand.id, name: model.brand.name }
        : null,
    };
  }
}
