import { Repository } from 'typeorm';
import { Permission } from '../../entities/permission.entity';
import { Role } from '../../entities/role.entity';

export async function seedPermissions(
  permissionsRepository: Repository<Permission>,
): Promise<void> {
  const permissions = [
    { name: 'create:ads', description: 'Permission to create ads' },
    { name: 'read:ads', description: 'Permission to display ads' },
    { name: 'update:ads', description: 'Permission to update ads' },
    { name: 'delete:ads', description: 'Permission to delete ads' },
    { name: 'manage:users', description: 'Permission to manage users' },
    { name: 'manage:roles', description: 'Permission to manage roles' },
    { name: 'manage:system', description: 'Permission to manage the system' },
  ];

  for (const permissionData of permissions) {
    const existing = await permissionsRepository.findOne({
      where: { name: permissionData.name },
    });
    if (!existing) {
      const permission = permissionsRepository.create(permissionData);
      await permissionsRepository.save(permission);
      console.log(`Permission ${permissionData.name} successfully created`);
    } else {
      console.log(
        `Permission ${permissionData.name} already existing, skipped`,
      );
    }
  }
}

export async function assignPermissionsToRoles(
  rolesRepository: Repository<Role>,
  permissionsRepository: Repository<Permission>,
): Promise<void> {
  const roles = await rolesRepository.find({ relations: ['permissions'] });
  const permissions = await permissionsRepository.find();

  const map = permissions.reduce((acc, p) => ({ ...acc, [p.name]: p }), {});

  for (const role of roles) {
    switch (role.name) {
      case 'admin':
        role.permissions = [...permissions];
        break;
      case 'manager':
        role.permissions = [
          map['create:ads'],
          map['read:ads'],
          map['update:ads'],
          map['delete:ads'],
          map['manage:users'],
        ];
        break;
      case 'seller':
        role.permissions = [
          map['create:ads'],
          map['read:ads'],
          map['update:ads'],
        ];
        break;
      case 'buyer':
        role.permissions = [map['read:ads']];
        break;
    }

    await rolesRepository.save(role);
    console.log(`Permissions assigned to the role ${role.name}`);
  }
}
