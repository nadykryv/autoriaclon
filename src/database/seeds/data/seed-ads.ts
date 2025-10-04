import { Repository } from 'typeorm';
import { CarAd } from '../../entities/car-ad.entity';
import { CarModel } from '../../entities/car-model.entity';
import { User } from '../../entities/user.entity';

export async function seedCarAds(
  carAdRepository: Repository<CarAd>,
  usersRepository: Repository<User>,
  carModelRepository: Repository<CarModel>,
): Promise<void> {
  const normalUsers = await usersRepository.find({
    where: { accountType: 'base' as const },
  });

  const premiumUsers = await usersRepository.find({
    where: { accountType: 'premium' as const },
  });

  const carModels = await carModelRepository.find({ relations: ['brand'] });

  if (!carModels.length) throw new Error('No car models found');

  const generateRandomAd = (user: User, model: CarModel): Partial<CarAd> => {
    const year =
      Math.floor(Math.random() * 20) + (new Date().getFullYear() - 20);
    const mileage = Math.floor(Math.random() * 150000) + 1000;
    const price = Math.floor(Math.random() * 50000) + 5000;

    const currencies: Array<'USD' | 'EUR' | 'UAH'> = ['USD', 'EUR', 'UAH'];

    return {
      title: `${model.brand.name} ${model.name} ${year}`,
      description: 'Car in excellent condition...',
      price,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      year,
      mileage,
      model,
      seller: user,
      status: 'active',
      views: Math.floor(Math.random() * 100),
    };
  };

  for (const user of normalUsers) {
    const count = await carAdRepository.count({
      where: { seller: { id: user.id } },
    });

    if (!count) {
      const ad = generateRandomAd(
        user,
        carModels[Math.floor(Math.random() * carModels.length)],
      );
      await carAdRepository.save(carAdRepository.create(ad));
      console.log(`Ad created for ${user.email}`);
    }
  }

  for (const user of premiumUsers) {
    const count = await carAdRepository.count({
      where: { seller: { id: user.id } },
    });

    for (let i = count; i < 2; i++) {
      const ad = generateRandomAd(
        user,
        carModels[Math.floor(Math.random() * carModels.length)],
      );
      await carAdRepository.save(carAdRepository.create(ad));
      console.log(`Premium ad created for ${user.email}`);
    }
  }
}
