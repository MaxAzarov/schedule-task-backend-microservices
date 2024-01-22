import { EntityManager, FindOptionsSelect } from 'typeorm';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { EventType } from '@app/common';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { Integration } from './entities/Integration.entity';
import { TrelloService } from '../trello/trello.service';
import { JiraService } from '../jira/jira.service';
import { EventsService } from '../events/events.service';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { normalizeTrelloEvents } from '../trello/helpers/normalizeEvents';
import { normalizeJiraEvents } from '../jira/helpers/normalizeEvents';
import { normalizeCustomEvents } from '../events/helpers/normalizeEvents';

@Injectable()
export class IntegrationsService {
  constructor(
    private readonly entityManger: EntityManager,
    @Inject(forwardRef(() => TrelloService))
    private readonly trelloService: TrelloService,
    private readonly jiraService: JiraService,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateIntegrationDto) {
    const integrationsRepository = this.entityManger.getRepository(Integration);

    // temporary solution
    const integration = await integrationsRepository.findOne({
      where: { type: dto.type, userId: dto.userId },
    });

    const { clientId, email } = await this.getClientIdByIntegrationType(
      dto.type,
      dto.accessToken,
    );

    dto.clientId = clientId;
    dto.email = email;

    if (integration) {
      return integration;
    }

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
      const data = await this.jiraService.me(accessToken);

      const { emailAddress } = await this.jiraService.myself(
        accessToken,
        data[0].id,
      );

      return { clientId: data[0].id, email: emailAddress };
    } else if (type === EventType.Trello) {
      const { id, email } = await this.trelloService.me(accessToken);

      return { clientId: id, email };
    }
  }

  public async getUserAccessToken(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { accessToken: true },
    );

    if (!integration) {
      throw new BadRequestException({
        error: 'No integration',
      });
    }

    return integration.accessToken;
  }

  public async getUserTodoColumnId(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { todoColumnId: true },
    );

    if (!integration) {
      throw new BadRequestException({
        error: 'No integration',
      });
    }

    return integration.todoColumnId;
  }

  public async getClientId(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { clientId: true },
    );

    if (!integration) {
      throw new BadRequestException({
        error: 'No integration',
      });
    }

    return integration.clientId;
  }

  public async getUserBoardId(userId: string, type: EventType) {
    const integration = await this.findOne(
      { userId, type },
      { projectId: true },
    );

    if (!integration) {
      throw new BadRequestException({
        message: 'No integration',
      });
    }

    return integration.projectId;
  }

  public async getUsersTasks(userId: string) {
    const [trelloEvents, jiraEvents, customEvents] = await Promise.all([
      this.trelloService.getUserCards(userId),
      this.jiraService.getAllUsersIssuesInStatus(userId),
      this.eventsService.findMany({ userId }),
    ]);

    return normalizeTrelloEvents(trelloEvents)
      .concat(normalizeJiraEvents(jiraEvents))
      .concat(normalizeCustomEvents(customEvents));
  }

  public async markEventAsDone(
    userId: string,
    type: EventType,
    cardId: string,
  ) {
    if (type === EventType.Trello) {
      return this.trelloService.markAsDoneCard(userId, cardId);
    } else if (type === EventType.Jira) {
      return this.jiraService.markAsDoneCard(userId, cardId);
    } else if (type === EventType.Custom) {
      return this.eventsService.delete(+cardId);
    }
  }
}
