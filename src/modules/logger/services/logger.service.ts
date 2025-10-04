import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { Config, SentryConfig } from '../../../configs/config.type';

@Injectable()
export class LoggerService {
  private readonly isLocal: boolean;
  private readonly logger = new Logger('AppLogger');

  constructor(private readonly configService: ConfigService<Config>) {
    const sentryConfig = this.configService.get<SentryConfig>('sentry');
    this.isLocal = sentryConfig.env === '.env';

    Sentry.init({
      dsn: sentryConfig.dsn,
      debug: false,
      integrations: [nodeProfilingIntegration()],
      tracesSampleRate: 1.0,
      profilesSampleRate: 1.0,
    });
  }

  public log(message: string): void {
    this.logger.log(message);
  }

  public info(message: string): void {
    this.logger.verbose(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public error(error: unknown): void {
    if (this.isLocal) {
      if (error instanceof Error) {
        this.logger.error(error.message, error.stack);
      } else {
        this.logger.error(JSON.stringify(error));
      }
    } else {
      Sentry.captureException(error, { level: 'error' });
    }
  }
}
