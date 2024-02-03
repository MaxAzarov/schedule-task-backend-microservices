import { firstValueFrom } from 'rxjs';
import { EntityManager, FindOptionsSelect } from 'typeorm';
import {
  BadRequestException,
  Inject,
  // Inject,
  Injectable,
  // forwardRef,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventType, JIRA_SERVICE, TRELLO_SERVICE } from '@app/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { Integration } from './entities/Integration.entity';
// import { TrelloService } from '../trello/trello.service';
// import { JiraService } from '../jira/jira.service';
import { EventsService } from '../events/events.service';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
// import { normalizeTrelloEvents } from '../trello/helpers/normalizeEvents';
// import { normalizeJiraEvents } from '../jira/helpers/normalizeEvents';
// import { normalizeCustomEvents } from '../events/helpers/normalizeEvents';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly entityManger: EntityManager,
    // @Inject(forwardRef(() => TrelloService))
    // private readonly trelloService: TrelloService,
    // private readonly jiraService: JiraService,

    @Inject(TRELLO_SERVICE) private readonly trelloClient: ClientProxy,
    @Inject(JIRA_SERVICE) private readonly jiraClient: ClientProxy,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateIntegrationDto) {
    const { type, userId, accessToken } = dto;
    const integrationsRepository = this.entityManger.getRepository(Integration);

    // temporary solution
    const integration = await integrationsRepository.findOne({
      where: { type: type, userId: userId },
    });

    if (integration) {
      return integration;
    }

    const { clientId, email } = await this.getClientIdByIntegrationType(
      type,
      accessToken,
    );

    dto.clientId = clientId;
    dto.email = email;

    return integrationsRepository.save(integrationsRepository.create(dto));
  }

  async findOne(
    fields: Pick<Integration, 'type' | 'userId'>,
    select?: FindOptionsSelect<Integration>,
  ) {
    const integrationsRepository = this.entityManger.getRepository(Integration);

    return integrationsRepository.findOne({ where: fields, select });
  }

  findMany(fields: Partial<Pick<Integration, 'userId'>>) {
    const integrationsRepository = this.entityManger.getRepository(Integration);

    return integrationsRepository.find({ where: fields });
  }

  delete(id: number) {
    const integrationsRepository = this.entityManger.getRepository(Integration);

    return integrationsRepository.delete(id);
  }

  update(id: number, dto: UpdateIntegrationDto) {
    const integrationsRepository = this.entityManger.getRepository(Integration);

    return integrationsRepository.save(
      integrationsRepository.create({ id, ...dto }),
    );
  }

  private async getClientIdByIntegrationType(
    type: EventType,
    accessToken: string,
  ): Promise<{ clientId: string; email: string }> {
    if (type === EventType.Jira) {
      const data = await firstValueFrom(
        this.jiraClient.emit('me', accessToken),
      );

      const { emailAddress } = await firstValueFrom(
        this.jiraClient.emit('myself', {
          accessToken,
          clientId: data[0].id,
        }),
      );

      return { clientId: data[0].id, email: emailAddress };
    } else if (type === EventType.Trello) {
      const { id, email } = await firstValueFrom(
        this.trelloClient.emit('me', accessToken),
      );

      return { clientId: id, email };
    }
  }

  public async getUserAccessToken(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { accessToken: true },
    );

    if (!integration) {
      throw new BadRequestException({ error: 'No integration' });
    }

    return integration.accessToken;
  }

  public async getUserTodoColumnId(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { todoColumnId: true },
    );

    if (!integration) {
      throw new BadRequestException({ error: 'No integration' });
    }

    return integration.todoColumnId;
  }

  public async getClientId(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { clientId: true },
    );

    if (!integration) {
      throw new BadRequestException({ error: 'No integration' });
    }

    return integration.clientId;
  }

  public async getUserBoardId(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { projectId: true },
    );

    if (!integration) {
      throw new BadRequestException({ message: 'No integration' });
    }

    return integration.projectId;
  }

  public async getUsersTasks(userId: string) {
    const [trelloIntegration, jiraIntegration] = await Promise.all([
      this.findOne({ userId, type: EventType.Trello }),
      this.findOne({ userId, type: EventType.Jira }),
    ]);

    const [customEvents, trelloEvents, jiraEvents] = await Promise.all([
      this.eventsService.findMany({ userId }),
      firstValueFrom(
        this.trelloClient.send('user_cards', {
          todoColumnId: trelloIntegration.todoColumnId,
          accessToken: trelloIntegration.accessToken,
          clientId: trelloIntegration.clientId,
        }),
      ),
      firstValueFrom(
        this.jiraClient.send('user_cards', {
          accessToken: jiraIntegration.accessToken,
          clientId: jiraIntegration.clientId,
          todoColumnId: jiraIntegration.todoColumnId,
          projectId: jiraIntegration.projectId,
          email: jiraIntegration.email,
        }),
      ),
    ]);

    return customEvents.concat(trelloEvents).concat(jiraEvents);
  }

  public async markEventAsDone(
    userId: string,
    type: EventType,
    cardId: string,
  ) {
    if (type === EventType.Trello) {
      const integration = await this.findOne({
        userId,
        type: EventType.Trello,
      });

      return firstValueFrom(
        this.trelloClient.send('mark_as_done', {
          readyColumnId: integration.readyColumnId,
          accessToken: integration.accessToken,
          cardId,
        }),
      );
    } else if (type === EventType.Jira) {
      // return this.jiraService.markAsDoneCard(userId, cardId);
    } else if (type === EventType.Custom) {
      return this.eventsService.delete(+cardId);
    }
  }

  // trello methods
  async getTrelloBoards(userId: string) {
    const accessToken = await this.getUserAccessToken(userId, EventType.Trello);

    return firstValueFrom(this.trelloClient.send('boards', accessToken));
  }

  async getTrelloUserCards(userId: string) {
    const integration = await this.findOne({
      userId,
      type: EventType.Trello,
    });

    if (!integration || !integration.todoColumnId || !integration.clientId) {
      return [];
    }

    return firstValueFrom(
      this.trelloClient.send('user_cards', {
        todoColumnId: integration.todoColumnId,
        accessToken: integration.accessToken,
        clientId: integration.clientId,
      }),
    );
  }

  async getTrelloBoardList(userId: string) {
    const integration = await this.findOne({
      userId,
      type: EventType.Trello,
    });

    if (!integration || !integration.projectId) {
      return [];
    }

    return firstValueFrom(
      this.trelloClient.emit('board_list', {
        userId,
        accessToken: integration.accessToken,
      }),
    );
  }

  // jira methods
  async getJiraBoards(userId: string) {
    const integration = await this.findOne({ userId, type: EventType.Jira });

    if (!integration) {
      return [];
    }

    return firstValueFrom(
      this.jiraClient.send('boards', {
        clientId: integration.clientId,
        accessToken: integration.accessToken,
      }),
    );
  }

  async getJiraProjectStatuses(userId: string) {
    const integration = await this.findOne({ userId, type: EventType.Jira });

    if (!integration || !integration.projectId) {
      return [];
    }

    return firstValueFrom(
      this.jiraClient.emit('project_statuses', {
        projectId: integration.projectId,
        clientId: integration.clientId,
        accessToken: integration.accessToken,
      }),
    );
  }
}
