## Permission System

The permission system will be based on an RBAC (Role-Based Access Control) approach with the possibility to assign granular permissions. This will allow easy future expansion for dealerships and other roles.

### Basic Permissions

- **users:create** - Create new users
- **users:read** - View users
- **users:update** - Update users
- **users:delete** - Delete users
- **ads:create** - Create ads
- **ads:read** - View ads
- **ads:update** - Update ads
- **ads:delete** - Delete ads
- **ads:moderate** - Moderate ads
- **brands:create** - Create car brands
- **brands:read** - View car brands
- **brands:update** - Update car brands
- **brands:delete** - Delete car brands
- **models:create** - Create car models
- **models:read** - View car models
- **models:update** - Update car models
- **models:delete** - Delete car models
- **stats:read** - View statistics

### Default Role Configuration

1. **Buyer**
    - ads:read
    - brands:read
    - models:read

2. **Seller (Basic)**
    - ads:create (limited to 1 ad)
    - ads:read
    - ads:update (only own ads)
    - ads:delete (only own ads)
    - brands:read
    - models:read

3. **Seller (Premium)**
    - ads:create (unlimited)
    - ads:read
    - ads:update (only own ads)
    - ads:delete (only own ads)
    - brands:read
    - models:read
    - stats:read

4. **Manager**
    - users:read
    - users:update (limited)
    - ads:read
    - ads:update
    - ads:delete
    - ads:moderate
    - brands:read
    - brands:update
    - models:read
    - models:update

5. **Administrator**
    - All permissions

### Extensibility for Dealerships

To support dealerships in the future, we will add:

1. **Dealership Entity**
    - Relationship with users (employees)
    - Dealership-specific roles

2. **Dealership-Specific Permissions**
    - dealership:manage
    - dealership:read
    - dealership:update
    - dealership:delete

3. **Dealership-Specific Roles**
    - Dealership Manager
    - Dealership Seller
    - Dealership Mechanic

This approach will allow adding new roles and permissions easily in the future without changing the core architecture.
