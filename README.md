<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

###
## AutoRiaClone
# Description

AutoRiaClone is a modern clone of the AutoRia platform for car sales. It supports car listings, image uploads to AWS S3, user management, roles, and premium/basic accounts.
Project developed for demonstration/examination purposes.

# Main Features

Flexible Role System: Buyer, Seller, Manager, Administrator
Account Types: Basic (1 ad) and Premium (unlimited ads + statistics)
Car Ads Management: Creation, editing, searching, automatic validation
Multi-currency Support: USD, EUR, UAH with daily exchange rate updates
Modular Architecture: Easily extendable for future features
Containerization: Ready for deployment on AWS

# System Requirements

Node.js >= 20
Docker & Docker Compose
PostgreSQL (via Neon or Docker)
pgAdmin (via Docker)
Redis
AWS S3 (for image storage)

# Environment Configuration

All sensitive values are stored in .env. For testing purposes, the actual .env file is not included.
Example .env.example contains fake credentials for local testing.

##  Local Setup (Docker Recommended)

1. Clone the repository:
 ```bash
git clone https://github.com/nadykryv/autoriaclon.git
cd autoriaclon
```
2. Install dependencies:
 ```bash 
   npm install
   ```
3. Configure environment variables:
```bash
Copy environment variables:
cp environments/.env.example .env
# Change the variables in the .env file as needed, deleting: _fakeaccesskey
```
4. Launch Docker containers:
 ```bash
   docker compose up --build
   npm run seed -- seed
   ```

# Start services:
npm run start:dev
docker-compose up -d

# Run in background:
docker compose up -d
Stop services:
docker compose down

# Containers included

autoria_app → Backend NestJS (port 3000)
autoria_pgadmin → pgAdmin (port 5050, email: admin@autoria.com
, password: admin)
autoria_redis → Redis (port 6379)
autoria_clon_s3 → MinIO (disabled if AWS S3 is used)

# Running the Application

Development:
npm run start:dev

Production:
npm run start:prod

# Database

PostgreSQL (credentials from .env or Docker Compose)
Run migrations:
npm run migration:run

Seed initial data:
npm run seed

# Postman Collection

File: AutoRiaClone.postman_collection.json
Steps:
Open Postman
Import the collection: File → Import → Choose File → AutoRiaClone.postman_collection.json
Follow the requests in order for registration, login, and API testing

# Roles and Permissions (RBAC)

Predefined Roles:
Role	Permissions
Buyer	View ads, contact sellers
Seller (Basic)	Create 1 ad, manage own ads
Seller (Premium)	Unlimited ads, view statistics
Manager	Moderate ads, manage users
Administrator	Full system access

# Ads Management

Automatic content check for inappropriate language
Ad can be modified up to 3 times if rejected
Managers notified for problematic ads
Multi-currency Support
Prices in USD, EUR, UAH
Automatic conversion to other currencies
Daily exchange rate updates

# Default Credentials (EXAMPLE)
Role	Email	Password
Admin	admin@example.com
Admin123!
Manager	manager@example.com
manager123
Seller	seller@example.com
Seller123!
Buyer	buyer@example.com
Buyer123!
User/Test	lisst@example.com
GuriRos567!

Use /auth/login for authentication.

# Useful Scripts
npm run start:docker:local   # Start Docker
npm run stop:docker:local    # Stop Docker
npm run down:docker:local    # Down Docker
npm run migration:generate   # Generate migration
npm run migration:create     # Create empty migration
npm run migration:run        # Run migrations
npm run seed                 # Seed DB

# API Documentation

Swagger docs available at:
http://localhost:3000/docs

# Deployment on AWS

Configure AWS credentials
Adjust environment variables for production
Deploy with AWS ECS or Kubernetes

# License

MIT License
