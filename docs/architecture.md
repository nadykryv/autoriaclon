# autorialone Project Architecture

## Architecture Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Client (Web)   │────▶│  NestJS API     │────▶│    Neon DB      │────▶│  PostgreSQL DB  │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              │
                              ▼
                        ┌─────────────────┐
                        │                 │
                        │  Redis Cache    │
                        │                 │
                        └─────────────────┘
```


## Modular Architecture

The project is structured according to NestJS modular architecture principles, with a clear separation of concerns:

### Application Layers

1. **Controllers**: Handle HTTP requests and delegate business logic to services
2. **Services**: Contain business logic and interact with repositories
3. **Repositories**: Manage data access via TypeORM
4. **Entities**: Define data structure and relationships

### Authentication Flow

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│         │     │             │     │              │     │             │
│ Client  │────▶│ AuthGuard   │────▶│ JWT Strategy │────▶│ Controller  │
│         │     │             │     │              │     │             │
└─────────┘     └─────────────┘     └──────────────┘     └─────────────┘
```


### Role-Based Access Control (RBAC)
```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│         │     │             │     │              │     │             │
│ Request │────▶│ RolesGuard  │────▶│ Roles Check  │────▶│ Controller  │
│         │     │             │     │              │     │             │
└─────────┘     └─────────────┘     └──────────────┘     └─────────────┘
```

## Main Entities ER Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    User     │       │    Role     │       │ Permission  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │       │ id          │       │ id          │
│ email       │       │ name        │       │ name        │
│ password    │       │ description │       │ description │
│ firstName   │       └──────┬──────┘       └──────┬──────┘
│ lastName    │              │                     │
│ isActive    │              │                     │
│ accountType │              │                     │
└──────┬──────┘              │                     │
       │                     │                     │
       │                ┌────┴─────────────────────┘
       │                │
       │                ▼
       │       ┌─────────────────┐
       │       │  Role_Permission│
       │       └────────┬────────┘
       │                │
       │                │
       │                │
┌──────┴──────┐  ┌──────┴──────┐  ┌─────────────┐  ┌─────────────┐
│   CarAd     │  │  CarModel   │  │  CarBrand   │  │CurrencyRate │
├─────────────┤  ├─────────────┤  ├─────────────┤  ├─────────────┤
│ id          │  │ id          │  │ id          │  │ id          │
│ title       │  │ name        │  │ name        │  │ baseCurrency│
│ description │  └──────┬──────┘  └──────┬──────┘  │ targetCurr  │
│ price       │         │                │         │ rate        │
│ currency    │         │                │         │ date        │
│ year        │         │                │         └─────────────┘
│ mileage     │◀────────┘                │
│ status      │                          │
│ rejectionCnt│                          │
│ views       │                          │
└─────────────┘                          │
                                         │
                                         ▼
```

## Listing Validation Flow


```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│ Listing     │────▶│ Content     │────▶│ Listing     │
│ Creation    │     │ Validation  │     │ Activation  │
│             │     │             │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                           │ (se contenuto inappropriato)
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │             │     │             │
                    │  Notify     │────▶│ Manager     │
                    │ Seller      │     │ Review      │
                    │             │     │             │
                    └─────────────┘     └─────────────┘
```

## Docker Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Docker Network                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │             │  │             │  │                 │  │
│  │  NestJS App │  │             │  │  Redis Cache    │  │
│  │  Container  │  │             │  │  Container      │  │
│  │             │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│         │                │                  │           │
│         └────────────────┼──────────────────┘           │
│                          │                              │
│                          ▼                              │
│                  ┌─────────────┐                        │
│                  │             │                        │
│                  │  pgAdmin    │                        │
│                  │  Container  │                        │
│                  │             │                        │
│                  └─────────────┘                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```


## AWS Deployment

```
┌─────────────────────────────────────────────────────────┐
│                         AWS Cloud                       │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │             │  │             │  │                 │  │
│  │  ECS/EKS    │  │  RDS        │  │  ElastiCache    │  │
│  │  (App)      │  │  (Database) │  │  (Redis)        │  │
│  │             │  │             │  │                 │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│         │                │                  │           │
│         └────────────────┼──────────────────┘           │
│                          │                              │
│                          ▼                              │
│                  ┌─────────────┐                        │
│                  │             │                        │
│                  │  API Gateway│                        │
│                  │             │                        │
│                  └─────────────┘                        │
│                          │                              │
│                          ▼                              │
│                  ┌─────────────┐                        │
│                  │             │                        │
│                  │  CloudFront │                        │
│                  │             │                        │
│                  └─────────────┘                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
