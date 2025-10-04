import { Repository } from 'typeorm';
import { CarBrand } from '../../entities/car-brand.entity';
import { CarModel } from '../../entities/car-model.entity';

export async function seedCarBrands(
  carBrandRepository: Repository<CarBrand>,
): Promise<void> {
  const brands = [
    'Audi',
    'BMW',
    'Mercedes',
    'Volkswagen',
    'Toyota',
    'Honda',
    'Ford',
    'Fiat',
    'Alfa Romeo',
    'Ferrari',
  ];

  for (const name of brands) {
    const exists = await carBrandRepository.findOne({ where: { name } });
    if (!exists) {
      const brand = carBrandRepository.create({ name });
      await carBrandRepository.save(brand);
      console.log(`Brand ${name} successfully created`);
    } else {
      console.log(`Brand ${name} already existing, skipped`);
    }
  }
}

export async function seedCarModels(
  carBrandRepository: Repository<CarBrand>,
  carModelRepository: Repository<CarModel>,
): Promise<void> {
  const brandModels = {
    Audi: ['A1', 'A3', 'A4'],
    BMW: ['Serie 1', 'Serie 3'],
    Mercedes: ['Classe A', 'Classe C'],
    Volkswagen: ['Golf', 'Polo'],
  };

  for (const [brandName, models] of Object.entries(brandModels)) {
    const brand = await carBrandRepository.findOne({
      where: { name: brandName },
    });

    if (brand) {
      for (const modelName of models) {
        const exists = await carModelRepository.findOne({
          where: { name: modelName },
        });
        if (!exists) {
          const model = carModelRepository.create({ name: modelName, brand });
          await carModelRepository.save(model);
          console.log(`Model ${modelName} per ${brandName} creato`);
        } else {
          console.log(
            `Model ${modelName} per ${brandName} already existing, skipped`,
          );
        }
      }
    }
  }
}
