import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currency.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrencyRate } from '../../database/entities/currency-rate.entity';
import { CurrencyService } from './services/currency.service';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate]), ScheduleModule.forRoot()],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}