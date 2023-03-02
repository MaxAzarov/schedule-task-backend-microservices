import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { JiraStrategy } from './jira-strategy/jira-strategy';
import { UserInfo } from './types/UserInfo';
import { Project } from './types/Project';
import { ProjectDetails } from './types/ProjectDetails';
import { Issues } from './types/Issues';
import { ProjectStatus } from './types/ProjectStatuses';

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
    const response = await firstValueFrom<Issues[]>(
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

    const response = await firstValueFrom<Issues[]>(
      this.http
        .get(`https://api.atlassian.com/ex/jira/${userId}/rest/api/3/search`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { jql: jqlQuery },
        })
        .pipe(map((x) => x.data)),
    );

    return response;
  }
}
