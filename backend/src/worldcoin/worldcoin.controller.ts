import { Controller, Get } from '@nestjs/common';

@Controller('worldcoin')
export class WorldcoinController {
  @Get()
  async getWorldcoin(): Promise<string> {
    return 'This is the worldcoin route';
  }
}
