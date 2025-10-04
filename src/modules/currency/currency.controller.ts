import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyService } from './services/currency.service';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates')
  @ApiOperation({ summary: 'Get the latest exchange rates' })
  @ApiResponse({ status: 200, description: 'List of exchange rates' })
  getLatestRates() {
    return this.currencyService.getLatestRates();
  }

  @Post('convert')
  @ApiOperation({ summary: 'Convert one currency to another' })
  @ApiResponse({ status: 200, description: 'Conversion done' })
  convertCurrency(
    @Body() data: { amount: number; fromCurrency: string; toCurrency: string },
  ) {
    return this.currencyService.convertCurrency(
      data.amount,
      data.fromCurrency,
      data.toCurrency,
    );
  }

  @Get('update')
  @ApiOperation({ summary: 'Manually update exchange rates' })
  @ApiResponse({ status: 200, description: 'Update started' })
  updateRates() {
    return this.currencyService.updateCurrencyRates();
  }
}
