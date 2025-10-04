import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';

export async function seedUsers(
  usersRepository: Repository<User>,
  rolesRepository: Repository<Role>,
): Promise<void> {
  const getRole = async (name: string) =>
    await rolesRepository.findOne({ where: { name } });

  const sellerRole = await getRole('seller');
  const adminRole = await getRole('admin');
  const managerRole = await getRole('manager');

  if (!sellerRole || !adminRole || !managerRole) {
    throw new Error('Missing core roles. Please seed the roles first.');
  }

  const users = [
    {
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      accountType: 'internal' as const,
      roles: [adminRole],
    },
    {
      email: 'manager@example.com',
      firstName: 'Manager',
      lastName: 'User',
      accountType: 'internal' as const,
      roles: [managerRole],
    },
  ];

  for (const userData of users) {
    const exists = await usersRepository.findOne({
      where: { email: userData.email },
    });

    if (!exists) {
      const hashedPassword = await bcrypt.hash('password', 10);
      const user = usersRepository.create({
        ...userData,
        password: hashedPassword,
        isActive: true,
      });
      await usersRepository.save(user);
      console.log(`User ${userData.email} successfully created`);
    } else {
      console.log(`User ${userData.email} already existing, skipped`);
    }
  }

  for (let i = 1; i <= 5; i++) {
    for (const type of ['base', 'premium'] as const) {
      const email = `${type === 'base' ? 'user' : 'premiumuser'}${i}@example.com`;
      const exists = await usersRepository.findOne({ where: { email } });

      if (!exists) {
        const hashedPassword = await bcrypt.hash('password', 10);
        const user = usersRepository.create({
          email,
          password: hashedPassword,
          firstName: `${type === 'base' ? 'Name' : 'PremiumNome'}${i}`,
          lastName: `${type === 'base' ? 'Surname' : 'PremiumSurname'}${i}`,
          isActive: true,
          accountType: type,
          roles: [sellerRole],
        });
        await usersRepository.save(user);
        console.log(`User ${type} ${email} successfully created`);
      } else {
        console.log(`User ${type} ${email} already existing, skipped`);
      }
    }
  }
}
