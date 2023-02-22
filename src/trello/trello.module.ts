import { Module } from '@nestjs/common';
import { TrelloStrategy } from './strategy/trello-strategy';
import { TrelloController } from './trello.controller';
import { TrelloService } from './trello.service';

@Module({
  controllers: [TrelloController],
  providers: [TrelloService, TrelloStrategy],
})
export class TrelloModule {}
