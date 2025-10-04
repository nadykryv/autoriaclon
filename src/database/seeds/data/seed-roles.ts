import { Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedRolesAndAdmin(
  rolesRepository: Repository<Role>,
  usersRepository: Repository<User>,
): Promise<void> {
  const roles = [
    { name: 'admin', description: 'Administrator with full system access' },
    {
      name: 'manager',
      description: 'Manager with access to ad and user management',
    },
    {
      name: 'seller',
      description: 'Seller with access to create and manage their own listings',
    },
    { name: 'buyer', description: 'Buyer with access to view ads' },
  ];

  // 1️⃣ Seed ruoli
  for (const roleData of roles) {
    const existingRole = await rolesRepository.findOne({
      where: { name: roleData.name },
    });
    if (!existingRole) {
      const role = rolesRepository.create(roleData);
      await rolesRepository.save(role);
      console.log(`Role ${roleData.name} created`);
    }
  }

  const createUserWithRole = async (
    email: string,
    password: string,
    roleName: string,
  ) => {
    const role = await rolesRepository.findOne({ where: { name: roleName } });
    if (!role) {
      console.error(`❌ Role ${roleName} not found — cannot create ${email}`);
      return;
    }

    let user = await usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = usersRepository.create({
        email,
        password: hashedPassword,
        firstName: roleName === 'admin' ? 'Admin' : 'Manager',
        lastName: 'User',
        roles: [role],
      });
      await usersRepository.save(user);
      console.log(`✅ User ${email} created with role ${roleName}`);
    } else {
      const hasRole = user.roles.some((r) => r.name === roleName);
      if (!hasRole) {
        user.roles.push(role);
        await usersRepository.save(user);
        console.log(`🔹 Role ${roleName} added to ${email}`);
      } else {
        console.log(`ℹ️ User ${email} already exists with role ${roleName}`);
      }
    }
  };

  // 2️⃣ Seed admin e manager
  await createUserWithRole('admin@example.com', 'admin123', 'admin');
  await createUserWithRole('manager@example.com', 'manager123', 'manager');
}
