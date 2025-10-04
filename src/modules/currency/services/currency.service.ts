import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { CurrencyRate } from '../../../database/entities/currency-rate.entity';
import { PrivatbankRate } from '../../../common/interfaces/privatbank-rate.interface';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(CurrencyRate)
    private currencyRateRepository: Repository<CurrencyRate>,
  ) {}

  @Cron('0 0 * * *') // Ogni giorno a mezzanotte
  async updateCurrencyRates(): Promise<void> {
    try {
      const response = await axios.get<PrivatbankRate[]>(
        'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
      );
      const rates: PrivatbankRate[] = response.data;

      for (const rate of rates) {
        await this.currencyRateRepository.save({
          baseCurrency: rate.base_ccy,
          targetCurrency: rate.ccy,
          rate: parseFloat(rate.buy),
          date: new Date(),
        });
      }

      this.logger.log('Currency rates updated successfully');
    } catch (error) {
      this.logger.error('Error updating exchange rates', error);
    }
  }

  async getLatestRates(): Promise<CurrencyRate[]> {
    const latestDatesSubQuery = this.currencyRateRepository
      .createQueryBuilder('subRate')
      .select('MAX(subRate.date)', 'maxDate')
      .addSelect('subRate.baseCurrency', 'baseCurrency')
      .addSelect('subRate.targetCurrency', 'targetCurrency')
      .groupBy('subRate.baseCurrency, subRate.targetCurrency');

    const latestRates = await this.currencyRateRepository
      .createQueryBuilder('rate')
      .innerJoin(
        '(' + latestDatesSubQuery.getQuery() + ')',
        'latest',
        'rate.baseCurrency = latest.baseCurrency AND rate.targetCurrency = latest.targetCurrency AND rate.date = latest.maxDate',
      )
      .setParameters(latestDatesSubQuery.getParameters())
      .getMany();

    return latestRates;
  }

  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    const rate = await this.currencyRateRepository.findOne({
      where: {
        baseCurrency: fromCurrency,
        targetCurrency: toCurrency,
      },
      order: { date: 'DESC' },
    });

    if (!rate) {
      throw new Error(
        `Exchange rate not found for ${fromCurrency} to ${toCurrency}`,
      );
    }

    return amount * rate.rate;
  }
}
