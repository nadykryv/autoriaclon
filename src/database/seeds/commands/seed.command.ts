import { Command, CommandRunner } from 'nest-commander';
import { SeedService } from '../services/seed.service';

@Command({
  name: 'seed',
  description: 'Populate the database with initial data',
})
export class SeedCommand extends CommandRunner {
  constructor(private readonly seedService: SeedService) {
    super();
  }

  async run(): Promise<void> {
    try {
      await this.seedService.seed();
      console.log('Seed completed successfully!');
    } catch (error) {
      console.error('Error while seeding:', error);
    } finally {
      process.exit(0);
    }
  }
}
