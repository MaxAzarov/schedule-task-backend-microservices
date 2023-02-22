import { Injectable } from '@nestjs/common';
import { TrelloStrategy } from './strategy/trello-strategy';

@Injectable()
export class TrelloService {
  constructor(private readonly trelloStrategy: TrelloStrategy) {}

  auth() {
    return this.trelloStrategy.getSignUrl();
  }

  callback(url: string) {
    const tokens = this.trelloStrategy.getUserTokens(url);

    return;
  }
}
