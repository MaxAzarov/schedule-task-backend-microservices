import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { User } from '@app/common';
import { TrelloStrategy } from './strategy/trello-strategy';
import { Board, BoardList, Card, Webhook } from './types';
import { GetBoardListDto } from './dto/get-board-list.dto';
import { GetUserCardsDto } from './dto/get-user-cards.dto';
import { MarkCardAsDoneDto } from './dto/mark-card-as-done.dto';

/**
 * flow:
 * 1. auth: get access and refresh tokens
 * 2. get trello user id and save it to integrations (access token, refresh token, user id)
 * 3. user select columns (lists). Save these data to integration
 * 4. get User Specific cards from select list(s)
 */

@Injectable()
export class TrelloService {
  private readonly TRELLO_BASE_URL: string = 'https://api.trello.com/1';
  private readonly logger = new Logger(TrelloService.name);

  constructor(
    private readonly trelloStrategy: TrelloStrategy,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  auth() {
    return this.trelloStrategy.getSignUrl();
  }

  async callback(url: string) {
    return await this.trelloStrategy.getUserTokens(url);
  }

  async getBoards(accessToken: string): Promise<Board[]> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    try {
      return await firstValueFrom<Board[]>(
        this.http
          .get(
            `${this.TRELLO_BASE_URL}/members/me/boards?key=${consumerKey}&token=${accessToken}`,
          )
          .pipe(map((x) => x.data)),
      );
    } catch (e) {
      this.logger.error('Can not get boards: ', e);
      if (e.response.status) {
        throw new BadRequestException({ error: 'Please reconnect' });
      }
    }
  }

  async me(accessToken: string): Promise<User> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    return await firstValueFrom<User>(
      this.http
        .get(
          `${this.TRELLO_BASE_URL}/members/me?fields=all&token=${accessToken}&key=${consumerKey}`,
        )
        .pipe(map((x) => x.data)),
    );
  }

  async getBoardList(data: GetBoardListDto): Promise<BoardList[]> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    return await firstValueFrom<BoardList[]>(
      this.http
        .get(
          `${this.TRELLO_BASE_URL}/boards/${data.projectId}/lists?token=${data.accessToken}&key=${consumerKey}`,
        )
        .pipe(map((x) => x.data)),
    );
  }

  private checkIfWebhookExists(webhooks: Webhook[], id: string): boolean {
    const webhookCallback = this.configService.get<string>(
      'TRELLO_WEBHOOK_CALLBACK',
    );

    return !webhooks.find(
      (webhook) =>
        webhook.idModel === id && webhook.callbackURL === webhookCallback,
    );
  }

  /**
   * returns all cards in list
   */
  async getListCards(listId: string, token: string): Promise<Card[]> {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const response = await firstValueFrom<Card[]>(
      this.http
        .get(
          `${this.TRELLO_BASE_URL}/lists/${listId}/cards?token=${token}&key=${consumerKey}`,
        )
        .pipe(map((x) => x.data)),
    );

    const webhooks = await this.getWebhooks(token);

    const idsToCreate = response.filter((item) =>
      this.checkIfWebhookExists(webhooks, item.id),
    );

    if (idsToCreate.length === 0) {
      return response;
    }

    await Promise.allSettled(
      idsToCreate.map((item) => this.createWebhook(item.id, token)),
    );

    return response;
  }

  async getUserCards({
    todoColumnId,
    accessToken,
    clientId,
  }: GetUserCardsDto): Promise<Card[]> {
    try {
      return await this.getListCards(todoColumnId, accessToken).then((cards) =>
        cards.filter((c) => c.idMembers.includes(clientId)),
      );
    } catch (e) {
      this.logger.error('Can not user cards: ', e);

      return [];
    }
  }

  async createWebhook(entityId: string, token: string) {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');
    const webhookCallback = this.configService.get<string>(
      'TRELLO_WEBHOOK_CALLBACK',
    );

    return await firstValueFrom<Webhook>(
      this.http
        .post(
          `${this.TRELLO_BASE_URL}/tokens/${token}/webhooks/?key=${consumerKey}`,
          JSON.stringify({
            description: 'My first webhook',
            callbackURL: webhookCallback,
            idModel: entityId,
          }),
          { headers: { 'Content-type': 'application/json' } },
        )
        .pipe(map((x) => x.data)),
    );
  }

  async getWebhooks(token: string) {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    return await firstValueFrom<Webhook[]>(
      this.http
        .get(
          `${this.TRELLO_BASE_URL}/tokens/${token}/webhooks/?key=${consumerKey}`,

          { headers: { 'Content-type': 'application/json' } },
        )
        .pipe(map((x) => x.data)),
    );
  }

  async markAsDoneCard({
    readyColumnId,
    accessToken,
    cardId,
  }: MarkCardAsDoneDto) {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    try {
      return await firstValueFrom<Card>(
        this.http
          .put(
            `${this.TRELLO_BASE_URL}/cards/${cardId}?idList=${readyColumnId}&token=${accessToken}&key=${consumerKey}`,
            { headers: { 'Content-type': 'application/json' } },
          )
          .pipe(map((x) => x.data)),
      );
    } catch (e) {
      this.logger.error('Can not mark card as done: ', e);
    }
  }
}
