import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { GetMyself, UserInfo } from './types/UserInfo';
import { Project } from './types/Project';
import { IssuesPaginated } from './types/Issues';
import { ProjectStatus } from './types/ProjectStatuses';
import { Webhook } from './types/Webhook';
import { ProjectDetails } from './types/ProjectDetails';
import { GetUserCardsDto } from './dto/get-user-cards.dto';
import { MarkCardAsDoneDto } from './dto/mark-card-as-done';
import { GetProjectStatusesDto } from './dto/get-project-statuses.dto';
import { GetBoardsDto } from './dto/get-boards.dto';
import { GetMyselfDto } from './dto/get-myself.dto';

/**
 * flow:
 * get cloudId (user id)
 * get projects and user select project(s) to add
 * show statuses (list) for each project(s)
 * user select statuses (list) and then we get issues getAllUsersIssuesInStatus
 */

@Injectable()
export class JiraService {
  private readonly logger = new Logger(JiraService.name);

  constructor(
    private readonly jiraStrategy: JiraStrategy,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  generateUrl() {
    return this.jiraStrategy.generateUrl();
  }

  async callback(url: string) {
    return await this.jiraStrategy.getUserTokens(url);
  }

  async getBoards({ clientId, accessToken }: GetBoardsDto) {
    try {
      const response = await firstValueFrom<Project[]>(
        this.http
          .get(
            `https://api.atlassian.com/ex/jira/${clientId}/rest/api/3/project/search`,
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
              },
            },
          )
          .pipe(map((x) => x.data)),
      );

      return response.values;
    } catch (e) {
      this.logger.error('Can not get boards:', e);
      return [];
    }
  }

  async getProjectDetails(clientId: string, key: string, token: string) {
    const response = await firstValueFrom<ProjectDetails>(
      this.http
        .get(
          `https://api.atlassian.com/ex/jira/${clientId}/rest/api/2/project/${key}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async me(token: string) {
    return await firstValueFrom<UserInfo[]>(
      this.http
        .get(`https://api.atlassian.com/oauth/token/accessible-resources`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        .pipe(map((x) => x.data)),
    );
  }

  async myself({ accessToken, clientId }: GetMyselfDto) {
    return await firstValueFrom<GetMyself>(
      this.http
        .get(
          `https://api.atlassian.com/ex/jira/${clientId}/rest/api/3/myself`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(map((x) => x.data)),
    );
  }

  async getTransitions(
    accessToken: string,
    clientId: string,
    issueId: string,
  ): Promise<any> {
    return await firstValueFrom<GetMyself>(
      this.http
        .get(
          `https://api.atlassian.com/ex/jira/${clientId}/rest/api/3/issue/${issueId}/transitions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(map((result) => result.data)),
    );
  }

  async getProjectStatuses({
    projectId,
    clientId,
    accessToken,
  }: GetProjectStatusesDto) {
    try {
      const response = await firstValueFrom<ProjectStatus[]>(
        this.http
          .get(
            `https://api.atlassian.com/ex/jira/${clientId}/rest/api/2/project/${projectId}/statuses`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          )
          .pipe(map((result) => result.data)),
      );

      /// first TASK, then subtask
      return response[0].statuses;
    } catch (e) {
      this.logger.error('Can not project statuses:', e);

      return [];
    }
  }

  private async getProjectStatus(
    accessToken: string,
    clientId: string,
    statusId: string,
  ) {
    try {
      return await firstValueFrom<ProjectStatus>(
        this.http
          .get(
            `https://api.atlassian.com/ex/jira/${clientId}/rest/api/2/status/${statusId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          )
          .pipe(map((result) => result.data)),
      );
    } catch (e) {
      this.logger.error('Can not project status:', e);
    }
  }

  async getAllIssues(userId: number, token: string) {
    return await firstValueFrom<IssuesPaginated>(
      this.http
        .get(`https://api.atlassian.com/ex/jira/${userId}/rest/api/3/search`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .pipe(map((result) => result.data)),
    );
  }

  async getAllUsersIssuesInStatus({
    accessToken,
    clientId,
    todoColumnId,
    projectId,
    email,
  }: GetUserCardsDto) {
    try {
      const userDetails = await this.me(accessToken);

      const [status, projectDetails] = await Promise.all([
        this.getProjectStatus(accessToken, clientId, todoColumnId),
        this.getProjectDetails(clientId, projectId, accessToken),
      ]);

      const jqlQuery = `assignee = currentUser() AND status = "${status.name}" AND project = "${projectId}"`;

      const response = await firstValueFrom<IssuesPaginated>(
        this.http
          .get(
            `https://api.atlassian.com/ex/jira/${clientId}/rest/api/3/search`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              params: { jql: jqlQuery },
            },
          )
          .pipe(map((result) => result.data)),
      );
      const userUrl = userDetails[0].url;

      const webhooks = await this.getWebhooks(email, userUrl);

      const exists = await this.checkIfWebhookExists(webhooks);

      if (!exists) {
        await this.createWebhook(
          projectDetails.key,
          status.name,
          email,
          userUrl,
        );
      }

      return response.issues;
    } catch (e) {
      this.logger.error('Can not user cards in status: ', e);

      return [];
    }
  }

  private checkIfWebhookExists(webhooks: Webhook[]) {
    const webhookCallback = this.configService.get<string>(
      'JIRA_WEBHOOK_CALLBACK',
    );

    return webhooks.find(
      (webhook) => webhook.url === webhookCallback && webhook.enabled,
    );
  }

  // public async checkToken(userId: number) {
  //   const integration = await this.integrationsService.findOne({
  //     userId,
  //     type: EventType.Jira,
  //   });

  //   try {
  //     await this.me(integration.accessToken);
  //   } catch (e) {
  //     const result = await this.jiraStrategy.renewAccessToken(
  //       integration.refreshToken,
  //     );

  //     await this.integrationsService.update(
  //       integration.id,
  //       plainToClass(UpdateIntegrationDto, {
  //         accessToken: result.access_token,
  //         refreshToken: result.refresh_token,
  //       }),
  //     );
  //   }
  // }

  public async markAsDoneCard({
    cardId,
    accessToken,
    clientId,
    readyColumnId,
  }: MarkCardAsDoneDto) {
    try {
      const transitions = await this.getTransitions(
        accessToken,
        clientId,
        cardId,
      );

      const transitionId = transitions.transitions.find(
        (transition) => transition.to.id === readyColumnId,
      );

      const data = { transition: { id: transitionId.id } };

      return await firstValueFrom<void>(
        this.http
          .post(
            `https://api.atlassian.com/ex/jira/${clientId}/rest/api/3/issue/${cardId}/transitions`,
            data,
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
              },
            },
          )
          .pipe(map((result) => result.data)),
      );
    } catch (e) {
      this.logger.error('Can not mark card as done: ', e);
    }
  }

  async getWebhooks(email: string, userUrl: string) {
    const jiraApiToken = this.configService.get<string>('JIRA_API_TOKEN');

    try {
      return await firstValueFrom<Webhook[]>(
        this.http
          .get(`${userUrl}/rest/webhooks/1.0/webhook`, {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Basic ${Buffer.from(
                `${email}:${jiraApiToken}`,
              ).toString('base64')}`,
            },
          })
          .pipe(map((result) => result.data)),
      );
    } catch (e) {
      this.logger.error('Can not get webhooks: ', e);

      return [];
    }
  }

  async createWebhook(
    project: string,
    status: string,
    email: string,
    userUrl: string,
  ) {
    const webhookCallback = this.configService.get<string>(
      'JIRA_WEBHOOK_CALLBACK',
    );
    const jiraApiToken = this.configService.get<string>('JIRA_API_TOKEN');

    const jqlQuery = `status = "${status}" AND project = "${project}"`;

    try {
      return await firstValueFrom<Webhook>(
        this.http
          .post(
            `${userUrl}/rest/webhooks/1.0/webhook`,
            JSON.stringify({
              name: `Webhook ${status}`,
              url: webhookCallback,
              events: ['jira:issue_created', 'jira:issue_updated'],
              filters: {
                'issue-related-events-section': jqlQuery,
              },
              excludeBody: false,
            }),
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Basic ${Buffer.from(
                  `${email}:${jiraApiToken}`,
                ).toString('base64')}`,
              },
            },
          )
          .pipe(map((result) => result.data)),
      );
    } catch (e) {
      this.logger.error('Can not create webhook: ', e);
    }
  }
}
