import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { TrelloStrategy } from './strategy/trello-strategy';
import { Board } from './types/Board';
import { BoardList } from './types/BoardList';
import { Card } from './types/Card';
import { User } from './types/User';
import { IntegrationsService } from 'src/integrations/integrations.service';
import { EventType } from 'src/integrations/types';

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
    @Inject(forwardRef(() => IntegrationsService))
    private readonly integrationsService: IntegrationsService,
    private readonly http: HttpService,
  ) {}

  auth() {
    return this.trelloStrategy.getSignUrl();
  }

  async callback(url: string) {
    return await this.trelloStrategy.getUserTokens(url);
  }

  async getBoards(userId: string): Promise<Board[]> {
    const token = await this.integrationsService.getUserAccessToken(
      userId,
      EventType.trello,
    );

    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    try {
      const response = await firstValueFrom<Board[]>(
        this.http
          .get(
            `https://api.trello.com/1/members/me/boards?key=${consumerKey}&token=${token}`,
          )
          .pipe(map((x) => x.data)),
      );

      return response;
    } catch (e) {
      if (e.response.status) {
        throw new BadRequestException({ error: 'Please reconnect' });
      }
    }
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

  async getBoardList(userId: string): Promise<BoardList[]> {
    const integration = await this.integrationsService.findOne({
      userId,
      type: EventType.trello,
    });

    if (!integration || !integration.projectId) {
      return [];
    }

    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const response = await firstValueFrom<BoardList[]>(
      this.http
        .get(
          `https://api.trello.com/1/boards/${integration.projectId}/lists?token=${integration.accessToken}&key=${consumerKey}`,
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  private checkIfWebhookExists(
    webhooks: {
      id: string;
      description: string;
      idModel: string;
      callbackURL: string;
      active: boolean;
      consecutiveFailures: number;
      firstConsecutiveFailDate: unknown;
    }[],
    id: string,
  ): boolean {
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
          `https://api.trello.com/1/lists/${listId}/cards?token=${token}&key=${consumerKey}`,
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

  async getUserCards(userId: string): Promise<Card[]> {
    try {
      const integration = await this.integrationsService.findOne({
        userId,
        type: EventType.trello,
      });

      if (!integration || !integration.todoColumnId || !integration.clientId) {
        return [];
      }

      const cards = await this.getListCards(
        integration.todoColumnId,
        integration.accessToken,
      );

      return cards.filter((c) => c.idMembers.includes(integration.clientId));
    } catch (e) {
      return [];
    }
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

  async getWebhooks(token: string) {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const response = await firstValueFrom<
      {
        id: string;
        description: string;
        idModel: string;
        callbackURL: string;
        active: boolean;
        consecutiveFailures: number;
        firstConsecutiveFailDate: unknown;
      }[]
    >(
      this.http
        .get(
          `https://api.trello.com/1/tokens/${token}/webhooks/?key=${consumerKey}`,

          { headers: { 'Content-type': 'application/json' } },
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async markAsDoneCard(userId: string, cardId: string) {
    const consumerKey = this.configService.get<string>('TRELLO_CLIENT_ID');

    const integration = await this.integrationsService.findOne({
      userId,
      type: EventType.trello,
    });

    if (!integration || !integration.readyColumnId) {
      return null;
    }

    try {
      const response = await firstValueFrom<Card>(
        this.http
          .put(
            `https://api.trello.com/1/cards/${cardId}?idList=${integration.readyColumnId}&token=${integration.accessToken}&key=${consumerKey}`,
            { headers: { 'Content-type': 'application/json' } },
          )
          .pipe(map((x) => x.data)),
      );

      return response;
    } catch (e) {}
  }
}
