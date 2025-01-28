import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorldcoinModule } from './worldcoin/worldcoin.module';
import { BaseModule } from './base/base.module';

@Module({
  imports: [WorldcoinModule, BaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
