import { Module } from '@nestjs/common';
import { WorldcoinController } from './worldcoin.controller';
import { WorldcoinService } from './worldcoin.service';

@Module({
  controllers: [WorldcoinController],
  providers: [WorldcoinService]
})
export class WorldcoinModule {}
