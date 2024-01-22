import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { EventType } from '@app/common';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { GetMyself, UserInfo } from './types/UserInfo';
import { Project } from './types/Project';
import { IssuesPaginated } from './types/Issues';
import { ProjectStatus } from './types/ProjectStatuses';
import { Webhook } from './types/Webhook';
import { ProjectDetails } from './types/ProjectDetails';
import { IntegrationsService } from '../integrations/integrations.service';
import { UpdateIntegrationDto } from '../integrations/dto/update-integration.dto';

/**
 * flow:
 * get cloudId (user id)
 * get projects and user select project(s) to add
 * show statuses (list) for each project(s)
 * user select statuses (list) and then we get issues getAllUsersIssuesInStatus
 */

@Injectable()
export class JiraService {
  constructor(
    private readonly jiraStrategy: JiraStrategy,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
    @Inject(forwardRef(() => IntegrationsService))
    private readonly integrationsService: IntegrationsService,
  ) {}

  generateUrl() {
    return this.jiraStrategy.generateUrl();
  }

  async callback(url: string) {
    return await this.jiraStrategy.getUserTokens(url);
  }

  async getBoards(userId: string) {
    try {
      await this.checkToken(userId);
      const integration = await this.integrationsService.findOne({
        userId,
        type: EventType.Jira,
      });

      if (!integration) {
        return [];
      }

      const response = await firstValueFrom<Project[]>(
        this.http
          .get(
            `https://api.atlassian.com/ex/jira/${integration.clientId}/rest/api/3/project/search`,
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${integration.accessToken}`,
                Accept: 'application/json',
              },
            },
          )
          .pipe(map((x) => x.data)),
      );

      return response.values;
    } catch (e) {
      return [];
    }
  }

  async getProjectDetails(userId: string, key: string, token: string) {
    const response = await firstValueFrom<ProjectDetails>(
      this.http
        .get(
          `https://api.atlassian.com/ex/jira/${userId}/rest/api/2/project/${key}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async me(token: string) {
    const response = await firstValueFrom<UserInfo[]>(
      this.http
        .get(`https://api.atlassian.com/oauth/token/accessible-resources`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        })
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async myself(accessToken: string, clientId: string) {
    const response = await firstValueFrom<GetMyself>(
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

    return response;
  }

  async getTransitions(
    accessToken: string,
    clientId: string,
    issueId: string,
  ): Promise<any> {
    const response = await firstValueFrom<GetMyself>(
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
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async getProjectStatuses(userId: string) {
    try {
      await this.checkToken(userId);
      const integration = await this.integrationsService.findOne({
        userId,
        type: EventType.Jira,
      });

      if (!integration || !integration.projectId) {
        return [];
      }

      const response = await firstValueFrom<ProjectStatus[]>(
        this.http
          .get(
            `https://api.atlassian.com/ex/jira/${integration.clientId}/rest/api/2/project/${integration.projectId}/statuses`,
            {
              headers: { Authorization: `Bearer ${integration.accessToken}` },
            },
          )
          .pipe(map((x) => x.data)),
      );

      /// first TASK, then subtask
      return response[0].statuses;
    } catch (e) {
      return [];
    }
  }

  private async getProjectStatus(
    userId: string,
    accessToken: string,
    clientId: string,
    statusId: string,
  ) {
    try {
      await this.checkToken(userId);

      const response = await firstValueFrom<ProjectStatus>(
        this.http
          .get(
            `https://api.atlassian.com/ex/jira/${clientId}/rest/api/2/status/${statusId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          )
          .pipe(map((x) => x.data)),
      );

      return response;
    } catch (e) {}
  }

  async getAllIssues(userId: string, token: string) {
    await this.checkToken(userId);
    const response = await firstValueFrom<IssuesPaginated>(
      this.http
        .get(`https://api.atlassian.com/ex/jira/${userId}/rest/api/3/search`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async getAllUsersIssuesInStatus(userId: string) {
    try {
      await this.checkToken(userId);
      const integration = await this.integrationsService.findOne({
        userId,
        type: EventType.Jira,
      });

      if (!integration || !integration.projectId) {
        return [];
      }
      const userDetails = await this.me(integration.accessToken);

      const { accessToken, clientId, todoColumnId, projectId } = integration;

      const [status, projectDetails] = await Promise.all([
        this.getProjectStatus(userId, accessToken, clientId, todoColumnId),
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
          .pipe(map((x) => x.data)),
      );
      const userUrl = userDetails[0].url;

      const webhooks = await this.getWebhooks(integration.email, userUrl);

      const exists = await this.checkIfWebhookExists(webhooks);

      if (!exists) {
        await this.createWebhook(
          projectDetails.key,
          status.name,
          integration.email,
          userUrl,
        );
      }

      return response.issues;
    } catch (e) {
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

  public async checkToken(userId: string) {
    const integration = await this.integrationsService.findOne({
      userId,
      type: EventType.Jira,
    });

    try {
      await this.me(integration.accessToken);
    } catch (e) {
      const result = await this.jiraStrategy.renewAccessToken(
        integration.refreshToken,
      );

      await this.integrationsService.update(
        integration.id,
        plainToClass(UpdateIntegrationDto, {
          accessToken: result.access_token,
          refreshToken: result.refresh_token,
        }),
      );
    }
  }

  public async markAsDoneCard(userId: string, cardId: string) {
    try {
      await this.checkToken(userId);
      const integration = await this.integrationsService.findOne({
        userId,
        type: EventType.Jira,
      });

      if (!integration || !integration.readyColumnId) {
        return null;
      }
      const transitions = await this.getTransitions(
        integration.accessToken,
        integration.clientId,
        integration.readyColumnId,
      );

      const transitionId = transitions.transitions.find(
        (transition) => transition.to.id === integration.readyColumnId,
      );

      const data = { transition: { id: transitionId.id } };

      const response = await firstValueFrom<void>(
        this.http
          .post(
            `https://api.atlassian.com/ex/jira/${integration.clientId}/rest/api/3/issue/${cardId}/transitions`,
            data,
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${integration.accessToken}`,
                Accept: 'application/json',
              },
            },
          )
          .pipe(map((x) => x.data)),
      );

      return response;
    } catch (e) {}
  }

  async getWebhooks(email: string, userUrl: string) {
    const jiraApiToken = this.configService.get<string>('JIRA_API_TOKEN');

    try {
      const response = await firstValueFrom<Webhook[]>(
        this.http
          .get(`${userUrl}/rest/webhooks/1.0/webhook`, {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Basic ${Buffer.from(
                `${email}:${jiraApiToken}`,
              ).toString('base64')}`,
            },
          })
          .pipe(map((x) => x.data)),
      );

      return response;
    } catch (e) {
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
      const response = await firstValueFrom<Webhook>(
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
          .pipe(map((x) => x.data)),
      );
      return response;
    } catch (e) {}
  }
}
