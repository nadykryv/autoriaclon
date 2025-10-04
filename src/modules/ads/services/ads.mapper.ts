import { CarAd } from '../../../database/entities/car-ad.entity';
import { CarAdResponseDto } from '../dto/res/car-ad-response.dto';

export class AdsMapper {
  static toResDto(ad: CarAd): CarAdResponseDto {
    return {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      status: ad.status,
      views: ad.views,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
      model: ad.model
        ? {
          id: ad.model.id,
          name: ad.model.name,
          brand: ad.model.brand
            ? { id: ad.model.brand.id, name: ad.model.brand.name }
            : null,
        }
        : null,
      seller: ad.seller
        ? {
          id: ad.seller.id,
          email: ad.seller.email,
        }
        : null,
    };
  }
}
