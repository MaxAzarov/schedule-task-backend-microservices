import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { TrelloStrategy } from './strategy/trello-strategy';
import { Board } from './types/Board';
import { BoardList } from './types/BoardList';
import { Card } from './types/Card';
import { User } from './types/User';

/**
 * flow:
 * 1. auth: get access and refresh tokens
 * 2. get trello user id and save it to integrations (access token, refresh token, user id)
 * 3. user select columns (lists). Save these data to integration
 * 4. get User Specific cards from select list(s)
 */

@Injectable()
export class TrelloService {
  constructor(
    private readonly trelloStrategy: TrelloStrategy,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  auth() {
    return this.trelloStrategy.getSignUrl();
  }

  async callback(url: string) {
    const tokens = await this.trelloStrategy.getUserTokens(url);

    return;
  }

  async getBoards(token: string): Promise<Board[]> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const response = await firstValueFrom<Board[]>(
      this.http
        .get(
          `https://api.trello.com/1/members/me/boards?key=${consumerKey}&token=${token}`,
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async me(token: string): Promise<User> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const response = await firstValueFrom<User>(
      this.http
        .get(
          `https://api.trello.com/1/members/me?fields=all&token=${token}&key=${consumerKey}`,
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async getBoardList(boardId: string, token: string): Promise<BoardList[]> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const response = await firstValueFrom<BoardList[]>(
      this.http
        .get(
          `https://api.trello.com/1/boards/${boardId}/lists?token=${token}&key=${consumerKey}`,
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  /**
   * returns all cards in list
   */
  async getListCards(listId: string, token: string): Promise<Card[]> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const response = await firstValueFrom<Card[]>(
      this.http
        .get(
          `https://api.trello.com/1/lists/${listId}/cards?token=${token}&key=${consumerKey}`,
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async getUserCards(
    listId: string,
    userId: string,
    token: string,
  ): Promise<Card[]> {
    const cards = await this.getListCards(listId, token);

    const userCards = cards.filter((c) => c.idMembers.includes(userId));

    return userCards;
  }

  async createWebhook(entityId: string, token: string) {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');
    const webhookCallback = this.configService.get<string>(
      'TRELLO_WEBHOOK_CALLBACK',
    );

    const response = await firstValueFrom<{
      id: string;
      description: string;
      idModel: string;
      callbackURL: string;
      active: boolean;
      consecutiveFailures: number;
      firstConsecutiveFailDate: unknown;
    }>(
      this.http
        .post(
          `https://api.trello.com/1/tokens/${token}/webhooks/?key=${consumerKey}`,
          JSON.stringify({
            description: 'My first webhook',
            callbackURL: webhookCallback,
            idModel: entityId,
          }),
          { headers: { 'Content-type': 'application/json' } },
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }
}
