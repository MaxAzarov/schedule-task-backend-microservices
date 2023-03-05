import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { UserInfo } from './types/UserInfo';
import { Project } from './types/Project';
import { ProjectDetails } from './types/ProjectDetails';
import { IssuesPaginated } from './types/Issues';
import { ProjectStatus } from './types/ProjectStatuses';
import { ConfigService } from '@nestjs/config';
import { Webhook } from './types/Webhook';

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
  ) {}

  generateUrl() {
    return this.jiraStrategy.generateUrl();
  }

  async callback(url: string) {
    const tokens = await this.jiraStrategy.getUserTokens(url);

    return;
  }

  async getBoards(userId: string, token: string) {
    const response = await firstValueFrom<Project[]>(
      this.http
        .get(`https://api.atlassian.com/ex/jira/${userId}/rest/api/2/project`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async getProjectDetails(userId: string, key: string, token: string) {
    const response = await firstValueFrom<ProjectDetails>(
      this.http
        .get(
          `https://api.atlassian.com/ex/jira/${userId}/rest/api/3/project/${key}`,
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

  async getProjectStatus(userId: string, key: string, token: string) {
    const response = await firstValueFrom<ProjectStatus[]>(
      this.http
        .get(
          `https://api.atlassian.com/ex/jira/${userId}/rest/api/2/project/${key}/statuses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async getAllIssues(userId: string, token: string) {
    const response = await firstValueFrom<IssuesPaginated>(
      this.http
        .get(`https://api.atlassian.com/ex/jira/${userId}/rest/api/3/search`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async getAllUsersIssuesInStatus(
    userId: string,
    project: string,
    status: string,
    token: string,
  ) {
    const jqlQuery = `assignee = currentUser() AND status = "${status}" AND project = "${project}"`;

    const response = await firstValueFrom<IssuesPaginated>(
      this.http
        .get(`https://api.atlassian.com/ex/jira/${userId}/rest/api/3/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { jql: jqlQuery },
        })
        .pipe(map((x) => x.data)),
    );

    return response;
  }

  async createWebhook(project: string, status: string) {
    const webhookCallback = this.configService.get<string>(
      'JIRA_WEBHOOK_CALLBACK',
    );
    const jiraApiToken = this.configService.get<string>('JIRA_API_TOKEN');

    // const jqlQuery = `assignee = currentUser() AND status = "${status}" AND project = "${project}"`;
    const jqlQuery = `status = "${status}" AND project = "${project}"`;
    const jiraEmail = 'volodor05412@gmail.com';

    const response = await firstValueFrom<Webhook>(
      this.http
        .post(
          `https://maksym-azarov.atlassian.net/rest/webhooks/1.0/webhook`,
          JSON.stringify({
            name: 'my first webhook via rest 1',
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
                `${jiraEmail}:${jiraApiToken}`,
              ).toString('base64')}`,
            },
          },
        )
        .pipe(map((x) => x.data)),
    );

    return response;
  }
}
